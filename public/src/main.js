var React = require("react");
var ReactDOM = require("react-dom");
var ReactBootstrap = require("react-bootstrap");
var DatePicker = require("react-bootstrap-date-picker");

var database = require("./database.js");

var TaskHeading = React.createClass({
  render : function() {

    var header = {
      "text-align": "center"
    };
    return (
      <div style={header} class="heading"><h1>{this.props.headingText}</h1></div>
    );
  }
});

var Content = React.createClass({
  getInitialState : function() {
    return {data : []};
  },
  setData : function(data) {
    if (!data) {
      data = [];
    }
    this.setState({data : data});
  },
  getTaskList : function() {
    this.props.fetchTasks(this.props.database, this.setData);
  },
  componentDidMount: function() {
    this.props.fetchTasks(this.props.database, this.setData);
    this.getTaskList();
  },
  handleAddTask: function(task, category) {
    var taskList = this.state.data;
    var key = Math.floor(Date.now() / 1000);
    taskList[key] = task;
    this.props.saveTask(this.props.database, key, task);
    this.setState({data: taskList});
  },
  handleDeleteTask: function(taskId) {
    var taskList = this.state.data;
    delete taskList[taskId];
    this.props.deleteTask(this.props.database, taskId);
    this.setState({data: taskList});
  },
  handleUpdateTask: function(taskId, task) {
    var taskList = this.state.data;
    taskList[taskId] = task;
    this.props.saveTask(this.props.database, taskId, task);
    this.setState({data: taskList});
  },
  render : function() {
    return (
      <div class="content">
        <TaskHeading headingText="My Tasks"></TaskHeading>
        <AddTaskBox onAddTask={this.handleAddTask}></AddTaskBox>
        <TaskList data={this.state.data} onUpdateTask={this.handleUpdateTask} onDeleteTask={this.handleDeleteTask}></TaskList>
      </div>
      );
  }
});

var TaskList = React.createClass({
    render : function() {
      var ListGroup = ReactBootstrap.ListGroup;
    
      var dataObject = this.props.data;
      var taskList = [];
      var key = 0;
      for (key in dataObject){
        if (dataObject[key]['status'] != 'Complete') {
          taskList.push(<Task data={dataObject[key]} onUpdateTask={this.props.onUpdateTask} onCompleteTask={this.props.onCompleteTask} onDeleteTask={this.props.onDeleteTask} taskKey={key} />);
        }
      }

      return (
        <div>
          {taskList}
        </div>
      )
  }
});

var TaskCategory = React.createClass({
  render : function() {
    var tasklist = this.props.tasks.map(function(task) {
      var ListGroupItem = ReactBootstrap.ListGroupItem; 
      var listGroupItem = {
            padding: '0px'
          };

      return (
        <ListGroupItem style={listGroupItem}><Task data={task} /></ListGroupItem>
      )
    });
    return (
      <div>
        <div><h3>{this.props.category}</h3></div>
        <div>{tasklist}</div>
      </div>
    );
  }
});

var Task = React.createClass({
  getInitialState : function() {
    return {name: this.props.data.name, date: this.props.data.date};
  },
  handleNameChange : function(e) {
    this.setState({name : e.target.value});
  },
  handleNameSave : function(e) {
    if (this.props.data.name != this.state.name) {
      var task = this.props.data;
      task.name = this.state.name;
      this.props.onUpdateTask(this.props.taskKey, task);
    }
  },
  handleOnDeleteTask: function(e) {
    this.props.onDeleteTask(this.props.taskKey);
  },
  handleOnCompleteTask: function(e) {
    var task = this.props.data;
    task.status = 'Complete';
    this.props.onUpdateTask(this.props.taskKey, task);
  },
  handleOnDateChange: function(date) {
    var formattedDate = "";
    if (date != null) {
      formattedDate = new Date(date).toString();
    }

    var task = this.props.data;
    this.setState({date : formattedDate});
    task.date = formattedDate;
    this.props.onUpdateTask(this.props.taskKey, task);
  },
  render: function() {
    var FormControl = ReactBootstrap.FormControl, InputGroup = ReactBootstrap.InputGroup, Button = ReactBootstrap.Button, InputGroupAddon = ReactBootstrap.InputGroup.Addon, FormGroup = ReactBootstrap.FormGroup;

    var datepicker = {
          width: '160px',
          padding: '0px'
        };

    return (
      <div class="task">
          <InputGroup>
            <FormControl type="text" value={this.state.name} onBlur={this.handleNameSave} onChange={this.handleNameChange}/>
            <InputGroupAddon style={datepicker}>
              <DatePicker calendarPlacement="left" value={this.state.date} dateFormat="YYYY-MM-DD" onChange={this.handleOnDateChange} />
            </InputGroupAddon>
            <InputGroupAddon>
              <Button className="task-complete-button" bsSize="xsmall" bsStyle="success" onClick={this.handleOnCompleteTask}>Complete</Button>
              <Button className="task-delete-button" bsSize="xsmall" bsStyle="danger" onClick={this.handleOnDeleteTask}>Delete</Button>
            </InputGroupAddon>
          </InputGroup>
        </div>
      );
  }
});

var AddTaskBox = React.createClass({
  getInitialState: function() {
    return {name : "", status : "Incomplete", date: new Date().toString()};
  },
   handleNameChange : function(e) {
    this.setState({name : e.target.value});
  },
  handleOnDateChange: function(date) {
    var formattedDate = "";
    if (date != null) {
      formattedDate = new Date(date).toString();
    }
    this.setState({date : formattedDate});
  },
  handleAddTask : function() {
    var name = this.state.name;

    if (!name) {
      return;
    }
    
    this.props.onAddTask({"name" : name, "status" : this.state.status, "date" : this.state.date});
    
    this.setState({name : ""});
  },
  render: function(){

    var dropdown = {
      width: '160px'
    };

    var datepicker = {
      width: '160px',
      padding: '0px'
    };

    var FormControl = ReactBootstrap.FormControl,  Button = ReactBootstrap.Button, ListGroup = ReactBootstrap.ListGroup, ListGroupItem = ReactBootstrap.ListGroupItem, InputGroup = ReactBootstrap.InputGroup, InputGroupButton = ReactBootstrap.InputGroup.Button, InputGroupAddon = ReactBootstrap.InputGroup.Addon;

    return (
      <div>
          <ListGroup>
            <ListGroupItem>
              <InputGroup>
                <FormControl type="text" value={this.state.name} placeholder="Enter text" onChange={this.handleNameChange}/>
                <InputGroupAddon style={datepicker}>
                  <DatePicker calendarPlacement="left" value={this.state.date} dateFormat="YYYY-MM-DD" onChange={this.handleOnDateChange} />
                </InputGroupAddon>
                <InputGroupButton>
                  <Button calss="add-button" onClick={this.handleAddTask} bsStyle="success">Add Task</Button>
                </InputGroupButton>
              </InputGroup>
            </ListGroupItem>
          </ListGroup>
        </div>
    );
  }
});

ReactDOM.render(<Content fetchTasks={database.fetchTaskList} saveTask={database.saveTask} deleteTask={database.deleteTask} database={database.database}/>, document.getElementById('content'));
