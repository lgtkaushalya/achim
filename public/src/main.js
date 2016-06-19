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

var Timer = React.createClass({
  getInitialState: function() {
    return {'time': this.props.time == null ? 0 : this.props.time, 'displayTime' :  this.getDisplayTime(this.props.time), 'isTimerOn' : false, 'timeIntervalPointer': null};
  },
  getDisplayTime : function(time) {

    if (time == null) {
      return "";
    }

    var minutes = parseInt(time / 60, 10);
    var seconds = parseInt(time % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
  },
  incrementTime: function() {
    var time = this.state.time;
    time += 1;
    var displayTime = this.getDisplayTime(time);
    this.setState({'time': time, 'displayTime' : displayTime});
  },
  startTimer : function() {
    this.state.timeintervalpointer = setInterval(this.incrementTime, 1000);
    this.setState({'isTimerOn' : true});
  },
  stopTimer : function() {
    clearInterval(this.state.timeintervalpointer);
    this.setState({'timeintervalpointer': null, 'isTimerOn' : false});
    this.props.handleOnTimeSetByTimer(this.state.time);
  },
  render : function() {

    var Button = ReactBootstrap.Button, InputGroupAddon = ReactBootstrap.InputGroup.Addon, Glyphicon = ReactBootstrap.Glyphicon, FormControl = ReactBootstrap.FormControl;

    var timerControl = [];

    var style = {
      button : {
        padding: "5px",
        margin: "5px"
      },
      buttoninputgroup : {
        padding: "0px",
        width: "115px"
      },
      textfield : {
        width: "70%"
      }
    }

    if (this.state.isTimerOn != true && this.state.time == 0) {
      timerControl.push(<Button style={style.button} onClick={this.startTimer} className="task-timer-button" bsSize="xsmall" bsStyle="primary"><Glyphicon glyph="time"/></Button>);
    } else if (this.state.isTimerOn != true && this.state.time != 0) {
      timerControl.push(<Button style={style.button} onClick={this.startTimer} className="task-timer-button" bsSize="xsmall" bsStyle="success"><Glyphicon glyph="play"/></Button>);
    } else {
      timerControl.push(<Button style={style.button} onClick={this.stopTimer} className="task-timer-button" bsSize="xsmall" bsStyle="danger"><Glyphicon glyph="off"/></Button>);  
    }

    return (
      <InputGroupAddon style={style.buttoninputgroup}>
        <FormControl placeholder="HH:MM" value={this.state.displayTime} style={style.textfield} type="text"/>
        {timerControl}
      </InputGroupAddon>
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
  handleOnTimeSetByTimer: function(time) {
    var task = this.props.data;
    task.time = time;
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
    var FormControl = ReactBootstrap.FormControl, InputGroup = ReactBootstrap.InputGroup, Button = ReactBootstrap.Button, InputGroupAddon = ReactBootstrap.InputGroup.Addon, FormGroup = ReactBootstrap.FormGroup, Glyphicon = ReactBootstrap.Glyphicon;

    var style = {
      datepicker: {
        width: '160px',
        padding: '0px'
      },
      buttoninputgroup: {
        padding: "3px 6px"
      },
      button: {
        padding: "5px"
      }
    };

    return (
      <div class="task">
          <InputGroup>
            <FormControl type="text" value={this.state.name} onBlur={this.handleNameSave} onChange={this.handleNameChange}/>
            <Timer handleOnTimeSetByTimer={this.handleOnTimeSetByTimer} time={this.props.data.time}/>
            <InputGroupAddon style={style.datepicker}>
              <DatePicker calendarPlacement="left" value={this.state.date} dateFormat="YYYY-MM-DD" onChange={this.handleOnDateChange} />
            </InputGroupAddon>
            <InputGroupAddon style={style.buttoninputgroup}>
              <Button style={style.button} className="task-complete-button" bsSize="xsmall" bsStyle="success" onClick={this.handleOnCompleteTask}>
                <Glyphicon glyph="ok"/>
              </Button>
            </InputGroupAddon>
            <InputGroupAddon style={style.buttoninputgroup}>
              <Button style={style.button} className="task-delete-button" bsSize="xsmall" bsStyle="danger" onClick={this.handleOnDeleteTask}>
                <Glyphicon glyph="remove"/>
              </Button>
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
