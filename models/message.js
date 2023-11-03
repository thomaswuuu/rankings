// CRUD messages
const messages = {
  success: (type) => {
    if (type == "C") return "Success: CREATE ok!";
    if (type == "U") return "Success: UPDATE ok!";
    if (type == "D") return "Success: DELETE ok!";
  },
  failed: (type) => {
    if (type == "C")
      return "Failed: CREATE is not allowed. Data is created, please update it!";
    if (type == "R")
      return "Failed: READ is not allowed. No data, please create it!";
    if (type == "U")
      return "Failed: UPDATE is not allowed. No data, please create it";
    if (type == "D")
      return "Failed: DELETE is not allowed. No data, please create it";
  },
};

module.exports = messages;
