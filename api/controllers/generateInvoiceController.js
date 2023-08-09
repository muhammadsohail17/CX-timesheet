const { generateInvoiceData } = require("../../common/renderMethods");
const mongoose = require("mongoose");

const Invoice = require("../models/invoice");
const InvoiceItem = require("../models/invoiceItems");

exports.generate_invoice = async (req, res, next) => {
  try {
    const { userId, month, year, hourlyRate, invoiceNo, customItems } =
      req.body;

    // Format customItems as needed
    const customItemsFormatted = customItems.map((item) => {
      return {
        customItem: item.customItem,
        customValue: item.customValue,
      };
    });

    // Generate invoice data
    let data = await generateInvoiceData(
      month,
      year,
      userId,
      hourlyRate,
      invoiceNo,
      customItemsFormatted
    );

    // Destructuring 'data' object to conveniently access and work with its properties
    const {
      rbUserId,
      rbProjectId,
      dateFrom,
      dateTo,
      totalLoggedHours,
      monthlyTotals,
    } = data;
    console.log("data", data);

    // Save the main invoice with reference to the main invoice item
    const userAlreadyExists = await Invoice.exists({ userId });
    let newInvoice;
    if (userAlreadyExists) {
      newInvoice = await Invoice.findOneAndUpdate(
        { userId },
        { hourlyRate },
        { new: true, upsert: true }
      );
    } else {
      const invoice = new Invoice({
        userId,
        month,
        year,
        hourlyRate,
        invoiceNo,
        customItems: customItemsFormatted,
      });
      newInvoice = await invoice.save();
    }

    // Save the main invoice item using the newInvoice._id
    const invoiceItem = new InvoiceItem({
      rbUserId,
      invoice_id: newInvoice._id,
      hourlyRate,
      rbProjectId,
      dateFrom,
      dateTo,
      totalLoggedHours,
      monthlyTotals,
    });
    const newInvoiceItem = await invoiceItem.save();

    // Collect the IDs of saved custom items
    const customItemIds = [];

    // Process and save custom items
    for (const customItemData of customItems) {
      const { customItem, customValue } = customItemData;
      const customInvoiceItem = new InvoiceItem({
        customItem,
        customValue,
        invoiceId: newInvoice._id,
      });
      const newCustomItem = await customInvoiceItem.save();
      customItemIds.push(newCustomItem._id);
    }

    // Return the response with the IDs of main invoice item and custom items
    return res.status(200).json({
      message: "Created invoice successfully",
      invoice: newInvoice,
      invoice_item: newInvoiceItem,
      customItemIds,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.get_hourly_rate = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(404).json({ message: "Invalid user ID." });
    }

    // Find the InvoiceItem document for the given userId
    const invoiceItem = await Invoice.findOne({ userId }).lean();

    if (!invoiceItem) {
      return res
        .status(404)
        .json({ message: "hourly rate not found for the user." });
    }

    // Extract the hourlyRate from the InvoiceItem and respond with the data
    const { hourlyRate } = invoiceItem;
    return res
      .status(200)
      .json({ message: "hourly rate found for the user.", hourlyRate });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the hourly rate." });
  }
};

exports.get_next_invoice_no = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(404).json({ message: "Invalid user ID." });
    }

    // Find the InvoiceItem document for the given userId
    const invoiceItem = await InvoiceItem.findOne({ rbUserId: userId })
      .sort({ invoiceNo: -1 })
      .lean();

    if (!invoiceItem) {
      // If there's no InvoiceItem for the user, create a new one with initial invoiceNo
      invoiceItem = await InvoiceItem.create({
        rbUserId: userId,
        invoiceNo: 1,
      });
    } else {
      // Increment the invoiceNo and save it back to the database
      invoiceItem.invoiceNo++;
      await InvoiceItem.findByIdAndUpdate(invoiceItem._id, {
        invoiceNo: invoiceItem.invoiceNo,
      });
    }

    // Respond with the updated or new invoiceNo
    return res.status(200).json({
      message: "invoice number for the user is:",
      invoiceNo: invoiceItem.invoiceNo,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the invoice number." });
  }
};
