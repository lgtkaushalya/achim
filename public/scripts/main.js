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
    this.props.saveTask(this.props.database, task);
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
      var ListGroup = ReactBootstrap.ListGroup;
    
      var dataObject = this.props.data;
      var taskList = [];
      var key = 0;
      for (key in dataObject){
        taskList.push(<Task data={dataObject[key]}/>);
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
  render: function() {
    var FormControl = ReactBootstrap.FormControl, InputGroup = ReactBootstrap.InputGroup, Button = ReactBootstrap.Button, InputGroupAddon = ReactBootstrap.InputGroup.Addon;

    var addon = {
          width: '100px'
        };

    return (
      <div class="task">
          <InputGroup>
            <FormControl type="text" value={this.props.data.name} disabled="true"/>
            <InputGroupAddon><Button calss="task-complete-button" bsSize="xsmall" bsStyle="success">Complete</Button>
            <Button calss="task-delete-button" bsSize="xsmall" bsStyle="danger">Delete</Button></InputGroupAddon>
          </InputGroup>
        </div>
      );
  }
});

var AddTaskBox = React.createClass({
  getInitialState: function() {
    return {name : "", category: "", status : "Incomplete"};
  },
   handleNameChange : function(e) {
    this.setState({name : e.target.value});
  },
  handleCategoryChange : function(e) {
    this.setState({category : e.target.value});
  },
  handleAddTask : function() {
    var name = this.state.name;
    var category = this.state.category;

    if (!name) {
      return;
    }
    
    this.props.onAddTask({"name" : name, "status" : this.state.status}, category);
    
    this.setState({name : "", category : ""});
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
                  <FormControl style={dropdown} class="category" value={this.state.category} onChange={this.handleCategoryChange} componentClass="select" placeholder="select">
                    <option>--Select Category--</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
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

ReactDOM.render(<Content fetchTasks={fetchTaskList} saveTask={saveTask} database={database}/>, document.getElementById('content'));
