const CxUser = require("../api/models/cxUsers");
const Logging = require("../api/models/logging");
const Task = require("../api/models/task");
const Project = require("../api/models/project");
const {
  toHoursAndMinutes,
  getLastSundayOfMonth,
  getWeeklyRanges,
  dateToUnixTimestamp,
  unixTimestampToDate,
} = require("../utils/util.js");

const renderUsersLoggings = async ({ month, year, invoice, userId }) => {
  if (month && year && invoice) {
    var dateFrom = dateToUnixTimestamp(getLastSundayOfMonth(month - 1, year));
    var dateTo = dateToUnixTimestamp(getLastSundayOfMonth(month, year));
  } else {
    var dateFrom = dateToUnixTimestamp(new Date(year, month - 1, 1));
    var dateTo = dateToUnixTimestamp(new Date(year, month, 0));
  }
  const users = userId
    ? await CxUser.find({ rbUserId: userId })
    : await CxUser.find();
  let loggingsData = [];
  for (const user of users) {
    let userData = {
      rbUserId: user.rbUserId,
      name: user.name,
      email: user.email,
    };
    let usertotalLoggedHours = null;
    let userLoggingsData = [];
    const userLoggings = await Logging.find({ rbUserId: user.rbUserId })
      .sort({ createdAt: "desc" })
      .exec();
    for (const userLogging of userLoggings) {
      let loggingDate = new Date(userLogging.timeTrackingOn);
      let loggingTimestamp = dateToUnixTimestamp(loggingDate);
      if (
        month &&
        year &&
        (loggingTimestamp < dateFrom || loggingTimestamp > dateTo)
      ) {
        continue;
      }
      const task = await Task.findOne({
        rbTaskId: userLogging.rbTaskId,
      }).exec();
      const project = await Project.findOne({
        rbProjectId: task.rbProjectId,
      }).exec();
      let loggingData = {
        rbCommentId: userLogging.rbCommentId,
        rbProjectId: task.rbProjectId,
        rbProjectName: project.name,
        rbTaskId: userLogging.rbTaskId,
        rbTaskName: task.name,
        loggingTime: toHoursAndMinutes(userLogging.minutes).totalTime,
        loggingDate: loggingDate.toLocaleDateString("en-US"),
        loggingTimestamp,
        createdAtDate: unixTimestampToDate(
          userLogging.createdAt
        ).toLocaleDateString("en-US"),
      };
      usertotalLoggedHours += userLogging.minutes;
      userLoggingsData.push(loggingData);
    }
    userData.totalLoggedHours =
      toHoursAndMinutes(usertotalLoggedHours).totalTime;
    userData.loggings = userLoggingsData;
    if (userData.loggings.length) {
      loggingsData.push(userData);
    }
  }
  return loggingsData;
};

const generateInvoiceData = async (
  month,
  year,
  userId,
  hourlyRate,
  invoiceNo,
  customItem = null,
  customValue = null
) => {
  const dateFrom = getLastSundayOfMonth(month - 1, year, 1);
  const dateTo = getLastSundayOfMonth(month, year);
  const invoiceDueDate = getLastSundayOfMonth(month, year);
  invoiceDueDate.setDate(invoiceDueDate.getDate() + 30);
  const weeklyRanges = getWeeklyRanges(dateFrom, dateTo);

  const projects = await Project.find().lean();
  const user = await CxUser.findOne(
    { rbUserId: userId },
    { password: 0 }
  ).lean();
  const loggings = await Logging.find({ rbUserId: userId })
    .sort({ createdAt: "desc" })
    .exec();
  let totalLoggedHours = 0;
  let loggingsData = [];
  if (loggings.length) {
    for (const project of projects) {
      let projectLoggingsData = [];
      for (const weeklyRange of weeklyRanges) {
        let weeklyLoggingsData = [];
        let weeklyTotalLoggedHours = 0;
        for (const logging of loggings) {
          let loggingDate = dateToUnixTimestamp(
            new Date(logging.timeTrackingOn)
          );
          if (
            loggingDate > weeklyRange.date_from &&
            loggingDate < weeklyRange.date_to
          ) {
            const task = await Task.findOne({
              rbTaskId: logging.rbTaskId,
            }).exec();

            if (task.rbProjectId == project.rbProjectId) {
              weeklyLoggingsData.push({
                rbCommentId: logging.rbCommentId,
                rbProjectId: task.rbProjectId,
                rbProjectName: project.name,
                rbTaskId: logging.rbTaskId,
                rbTaskName: task.name,
                loggingTime: toHoursAndMinutes(logging.minutes).totalTime,
                loggingDate:
                  unixTimestampToDate(loggingDate).toLocaleDateString("en-US"),
                loggingTimestamp: loggingDate,
                createdAtDate: unixTimestampToDate(logging.createdAt),
              });
              totalLoggedHours += logging.minutes;
              weeklyTotalLoggedHours += logging.minutes;
            }
          }
        }
        if (weeklyLoggingsData.length) {
          projectLoggingsData.push({
            ...weeklyRange,
            weeklyTotalLoggedHours: toHoursAndMinutes(weeklyTotalLoggedHours)
              .totalHoursAndMinutes,
            weeklyTotals:
              Math.round((weeklyTotalLoggedHours / 60) * hourlyRate * 100) /
              100,
            weeklyLoggingsData,
            hourlyRate,
            projectName: project.name,
          });
        }
      }
      if (projectLoggingsData.length) {
        loggingsData.push({
          ...project,
          projectLoggingsData,
        });
      }
    }
  }

  let data = {
    ...user,
    currency: process.env.CURRENCY,
    companyName: process.env.INVOICE_COMPANY_NAME,
    companyAddress: process.env.INVOICE_COMPANY_ADDRESS,
    month,
    year,
    userId,
    hourlyRate,
    invoiceNo,
    invoiceDate: dateTo.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    invoiceDueDate: invoiceDueDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    dateFrom: Math.floor(dateFrom.getTime() / 1000),
    dateTo: Math.floor(dateTo.getTime() / 1000),
    totalLoggedHours: toHoursAndMinutes(totalLoggedHours).totalHoursAndMinutes,
    monthlyTotals: (totalLoggedHours / 60) * hourlyRate,
    loggingsData,
  };

  if (customItem && customValue) {
    let customItems = [];
    if (typeof customItem == "object" && typeof customValue == "object") {
      for (let i = 0; i < customItem.length; i++) {
        if (customItem[i] && customValue[i]) {
          customItems.push({
            item: customItem[i],
            value: customValue[i],
          });
          data.monthlyTotals += parseFloat(customValue);
        }
      }
    } else {
      customItems.push({
        item: customItem,
        value: customValue,
      });
      data.monthlyTotals += parseFloat(customValue);
    }
    data.customItems = customItems;
  }

  data.monthlyTotals = Math.round(data.monthlyTotals * 100) / 100;
  return data;
};

module.exports = {
  renderUsersLoggings,
  generateInvoiceData,
};
