var TaskHeading = React.createClass({
  render : function() {
    return (
      <div class="heading"><h1>{this.props.headingText}</h1></div>
    );
  }
});

var Content = React.createClass({
  getInitialState : function() {
    return {data : []};
  },
  getTaskList : function() {
    var taskList = JSON.parse(localStorage.getItem('taskList'));
    if (!taskList) {
    taskList = [];
    }
    return taskList;
  },
  componentDidMount: function() {
    var taskList = this.getTaskList();
    this.setState({data : taskList});
  },
  handleAddTask: function(task) {
    var taskList = this.state.data;
    taskList.push(task);
    localStorage.setItem('taskList', JSON.stringify(taskList));
    this.setState({data: taskList})
  },
  render : function() {
    return (
      <div class="content">
        <TaskHeading headingText="My Tasks"></TaskHeading>
        <AddTaskBox onAddTask={this.handleAddTask}></AddTaskBox>
        <TaskList data={this.state.data}></TaskList>
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

var AddTaskBox = React.createClass({
  getInitialState: function() {
    return {name : "", priority : "", urgency : "", status : "Incomplete"};
  },
   handleNameChange : function(e) {
    this.setState({name : e.target.value});
  },
  handlePriorityChange : function(e) {
    this.setState({priority : e.target.value});
  },
  handleUrgencyChange : function(e) {
    this.setState({urgency : e.target.value});
  },
  handleAddTask : function() {
    var name = this.state.name;
    var priority = this.state.priority;
    var urgency = this.state.urgency;

    if (!name || !priority || !urgency) {
      return;
    }
    
    this.props.onAddTask({"name" : name, "priority" : priority, "urgency" : urgency, "status" : this.state.status});
    
    this.setState({name : "", priority : "", urgency : ""});
  },
  render: function(){
    return (
      <div>
        <input type="text" value={this.state.name} onChange={this.handleNameChange}></input>
        <select class="priority" value={this.state.priority} onChange={this.handlePriorityChange}>
          <option>--Select Priority--</option>
          <option>High</option>
          <option>Low</option>
        </select>
        <select class="urgency" value={this.state.urgency} onChange={this.handleUrgencyChange}>
          <option>--Select Urgentness--</option>
          <option>Urgent</option>
          <option>Not Urgent</option>
        </select>
        <button class="add-button" onClick={this.handleAddTask}>Add Task</button></div>
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

ReactDOM.render(<Content/>, document.getElementById('content'));
