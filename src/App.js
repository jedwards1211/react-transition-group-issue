import React, {Component} from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';

function log(text) {
  console.log(`[${new Date().toTimeString()}]: ${text}`);
}

class Item extends Component {
  componentWillEnter = (callback) => {
    log(this.props.id + ' entering...');
    setTimeout(callback, 3000);
  }
  componentDidEnter = () => {
    log(this.props.id + ' entered');
  }
  componentWillLeave = (callback) => {
    log(this.props.id + ' leaving...');
    setTimeout(callback, 100);
  }
  componentDidLeave = () => {
    log(this.props.id + ' left');
  }
  render() {
    return <div>Item {this.props.id}</div>;
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.counter = 0;
    this.state = {
      components: [] 
    };
  }
  componentDidMount() {
    this.interval = setInterval(this.addChild, 5000);
    this.addChild();
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    clearTimeout(this.timeout);
  }
  addChild = () => {
    let id = this.counter++;
    let newChild = <Item key={id} id={id}/>;
    this.setState({
      components: [...this.state.components, newChild]
    }, () => log(`added $(key}`));
    this.timeout = setTimeout(() => this.removeChild(id), 1000);
  }
  removeChild = (key) => {
    let {components} = this.state;
    let index = components.findIndex(child => child.key == key);
    if (index >= 0) {
      let removedChild = components[index];
      this.setState({
        components: [...components.slice(0, index), ...components.slice(index + 1)]
      }, () => log(`removed ${key}`));
      // this.timeout = setTimeout(() => this.addBackChild(removedChild), 100);
    }
  }
  addBackChild = (child) => {
    this.setState({
      components: [...this.state.components, child]
    }, () => log(`added back ${child.key}`));
  }
  render() {
    return <ReactTransitionGroup component="div">
      {this.state.components}
    </ReactTransitionGroup>;
  }
}
