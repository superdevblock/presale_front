import React, { Component } from "react";
import { getUTCNow } from '../utils';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }
  componentDidMount() {
    this.getTimeUntil(this.props.deadline);
    setInterval(() => this.getTimeUntil(this.props.deadline), 1000);
  }
  leading0(num) {
    return num < 10 ? "0" + num : num;
  }
  getTimeUntil(deadline) {
    const time = deadline - getUTCNow();
    if (time < 0) {
      this.setState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      this.props.setEnded(true);
    } else {
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
      const days = Math.floor(time / (1000 * 60 * 60 * 24));
      this.setState({ days, hours, minutes, seconds });
    }
  }
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }
  render() {
    return (
      <div className="d-flex justify-content-center gap-3">
        <div className="Clock-item">
          <div className="Clock-content">
            <div className="Clock-days style-2">
              {this.leading0(this.state.days)}
            </div>
          </div>
          DAYS
        </div>
        <div className="Clock-item">
          <div className="Clock-content">
            <div className="Clock-days style-2">
              {this.leading0(this.state.hours)}
            </div>
          </div>
          HRS
        </div>
        <div className="Clock-item">
          <div className="Clock-content">
            <div className="Clock-days style-2">{this.leading0(this.state.minutes)}</div>
          </div>
          MIN
        </div>
        <div className="Clock-item">
          <div className="Clock-content">
            <div className="Clock-days style-2">{this.leading0(this.state.seconds)}</div>
          </div>
          SEC
        </div>
      </div>
    );
  }
}
export default Clock;
