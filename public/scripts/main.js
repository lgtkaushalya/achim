var TaskList = React.createClass({
  render : function() {
      var tasks = this.props.data.map(function(task) {
        return (
          <Task key={task.id} name={task.name} />
        )
      });
      
      return (
        <div className="taskList">
          <h1>Task List</h1>
          {tasks}
        </div>
      )
  }
});

var Task = React.createClass({
  render: function() {
    return (
      <div>{this.props.name}</div>
    );
  }
});

var data = [
  {"id" : 1, "name" : "Check Emails"},
  {"id" : 2, "name" : "Development"},
  {"id" : 3, "name" : "Meetings"}
];
ReactDOM.render(<TaskList data={data}/>, document.getElementById('content'));
