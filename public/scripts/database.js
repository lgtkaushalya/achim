firebase.initializeApp(firebaseconfig);
var database = firebase.database();

var fetchTaskList = function(database, setData) {
  database.ref().child('taskList').on('value', function(taskList) {
    setData(taskList.val());
  }.bind(this));
}

var saveTask = function(database, task) {
  database.ref().child('taskList').push(task);
}
