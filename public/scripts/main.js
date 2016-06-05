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
     var ListGroup = ReactBootstrap.ListGroup, ListGroupItem = ReactBootstrap.ListGroupItem;
    var listGroupItem = {
          padding: '0px'
        };

     var tasks = this.props.data.map(function(task) {
        return (
          <ListGroupItem style={listGroupItem}><Task data={task} /></ListGroupItem>
        )
      });

      return (
        <ListGroup className="task-list">
          {tasks}
        </ListGroup>
      )
  }
});


var Task = React.createClass({
  render: function() {
    var FormControl = ReactBootstrap.FormControl, InputGroup = ReactBootstrap.InputGroup, Button = ReactBootstrap.Button, InputGroupAddon = ReactBootstrap.InputGroup.Addon;

    var addon = {
          width: '100px'
        };

    return (
      <div class="task">
          <InputGroup>
            <FormControl type="text" value={this.props.data.name} disabled="true"/>
            <InputGroupAddon style={addon}>{this.props.data.priority}</InputGroupAddon>
            <InputGroupAddon style={addon}>{this.props.data.urgency}</InputGroupAddon>
            <InputGroupAddon><Button calss="task-complete-button" bsSize="xsmall" bsStyle="success">Complete</Button>
            <Button calss="task-delete-button" bsSize="xsmall" bsStyle="danger">Delete</Button></InputGroupAddon>
          </InputGroup>
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

    var dropdown = {
      width: '160px'
    };

    var FormControl = ReactBootstrap.FormControl,  Button = ReactBootstrap.Button, ListGroup = ReactBootstrap.ListGroup, ListGroupItem = ReactBootstrap.ListGroupItem, InputGroup = ReactBootstrap.InputGroup, InputGroupButton = ReactBootstrap.InputGroup.Button;

    return (
      <div>
          <ListGroup>
            <ListGroupItem>
              <InputGroup>
                <FormControl type="text" value={this.state.name} placeholder="Enter text" onChange={this.handleNameChange}/>
                <InputGroupButton>
                  <FormControl style={dropdown} class="priority" value={this.state.priority} onChange={this.handlePriorityChange} componentClass="select" placeholder="select">
                    <option>--Select Priority--</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                  </FormControl>
                </InputGroupButton>
                <InputGroupButton>
                  <FormControl style={dropdown} class="urgency" value={this.state.urgency} onChange={this.handleUrgencyChange} componentClass="select" placeholder="select">
                    <option>--Select Urgency--</option>
                    <option value="High">Urgent</option>
                    <option value="Low">Not Urgent</option>
                  </FormControl>
                </InputGroupButton>
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
    var ButtonToolbar = ReactBootstrap.ButtonToolbar,
                Button  = ReactBootstrap.Button;
    return (
      <div class="task-actions">
        <ButtonToolbar>
          <div class="task-complete-div">
            <Button calss="task-complete-button" bsSize="xsmall" bsStyle="success">Complete</Button>
          </div>
          <div class="task-delete-div">
            <Button calss="task-delete-button" bsSize="xsmall" bsStyle="danger">Remove</Button>
          </div>
        </ButtonToolbar>
      </div>
    );
  }
});

ReactDOM.render(<Content/>, document.getElementById('content'));
