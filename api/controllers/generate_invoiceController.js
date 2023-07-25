const { generateInvoiceData } = require("../../common/renderMethods");
const mongoose = require("mongoose");

const Invoice = require("../models/invoice");
const InvoiceItem = require("../models/invoiceItems");

exports.generate_invoice = async (req, res, next) => {
  try {
    const { userId, month, year, hourlyRate, invoiceNo, customItems } =
      req.body;

    // Generate invoice data
    let data = await generateInvoiceData(
      month,
      year,
      userId,
      hourlyRate,
      invoiceNo,
      customItems
    );

    // Destructuring 'data' object to conveniently access and work with its properties
    const {
      name,
      rbUserId,
      username,
      email,
      status,
      companyName,
      companyAddress,
      currency,
      invoiceDate,
      invoiceDueDate,
      totalLoggedHours,
      monthlyTotals,
      loggingsData,
    } = data;

    // Save the main invoice item
    const invoiceItem = new InvoiceItem({
      name,
      rbUserId,
      username,
      email,
      status,
      currency,
      companyName,
      companyAddress,
      invoiceNo,
      invoiceDate,
      invoiceDueDate,
      totalLoggedHours,
      monthlyTotals,
      loggingsData,
    });
    const newInvoiceItem = await invoiceItem.save();

    // Convert customItems to the appropriate format for saving in the Invoice model
    const customItemsFormatted = customItems.map(
      ({ customItem, customValue }) => ({
        customItem,
        customValue,
      })
    );

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
        invoice_id: newInvoiceItem._id,
        userId,
        month,
        year,
        hourlyRate,
        customItems: customItemsFormatted,
      });
      newInvoice = await invoice.save();
    }

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
      mainInvoiceItem: newInvoiceItem,
      mainInvoice: newInvoice,
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
        .json({ message: "Hourly rate not found for the user." });
    }

    // Extract the hourlyRate from the InvoiceItem and respond with the data
    const { hourlyRate } = invoiceItem;
    return res.status(200).json({ hourlyRate });
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
    return res.status(200).json({ invoiceNo: invoiceItem.invoiceNo });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the invoice number." });
  }
};
