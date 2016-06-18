var Firebase = require("firebase");
var firebaseconfig = require("./config.js");

Firebase.initializeApp(firebaseconfig);
var database = Firebase.database();

var fetchTaskList = function(database, setData) {
  database.ref().child('taskList').on('value', function(taskList) {
    setData(taskList.val());
  }.bind(this));
}

var saveTask = function(database, taskId, task) {
  database.ref('/taskList/'+taskId).update(task);
}

var deleteTask = function(database, taskId) {
  database.ref('/taskList/'+taskId).remove();
}

module.exports = {
  "fetchTaskList": fetchTaskList,
  "saveTask": saveTask,
  "deleteTask": deleteTask,
  "database": database
};
