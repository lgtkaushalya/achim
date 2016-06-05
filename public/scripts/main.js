var TaskHeading = React.createClass({
  render : function() {
    return (
      <div class="heading"><h1>{this.props.headingText}</h1></div>
    );
  }
});

var Content = React.createClass({
  render : function() {
    return (
      <div class="content">
        <TaskHeading headingText="My Tasks"></TaskHeading>
        <AddButton>Add Task</AddButton>
        <TaskList data={data}></TaskList>
      </div>
      );
  }
});

var TaskList = React.createClass({
  render : function() {
      var tasks = this.props.data.map(function(task) {
        return (
          <Task data={task} />
        )
      });
      
      return (
        <div className="task-list">
          {tasks}
        </div>
      )
  }
});


var Task = React.createClass({
  render: function() {
    return (
      <div class="task">
        <div class="task-name">{this.props.data.name}</div>
          <TaskStatus data={this.props.data}></TaskStatus>
          <TaskAction></TaskAction>
        </div>
      );
  }
});

var AddButton = React.createClass({
  render: function(){
    return (
      <div><button class="add-button">{this.props.children}</button></div>
    );
  }
});

var TaskStatus = React.createClass({
  render: function() {
    return (
      <div class="task-status">
        <div class="task-priority">{this.props.data.priority}</div>
        <div class="task-urgency">{this.props.data.urgency}</div>
      </div>
    );
  }
});

var TaskAction = React.createClass({
  render: function() {
    return (
      <div class="task-actions">
        <div class="task-complete-div">
          <button class="task-complete-button">Complete</button>
        </div>
        <div class="task-delete-div">
          <button class="task-delete-button">Remove</button>
        </div>
      </div>
    );
  }
});

var data = [
  {"id" : 1, "name" : "Check Emails", "priority" : "High", "urgency" : "Not Urgent"},
  {"id" : 2, "name" : "Development", "priority" : "Low", "urgency" : "Urgent"},
  {"id" : 3, "name" : "Meetings", "priority" : "High", "urgency" : "Urgent"}
];
ReactDOM.render(<Content data={data}/>, document.getElementById('content'));
