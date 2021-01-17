import {Modal, Button} from 'antd';
import React, {Component} from 'react';
import AddEvent from './AddEvent';

class AddEventModal extends Component {
  state = {
    title: '',
  };

  static getDerivedStateFromProps (nextProps) {
    if (nextProps.eventTitle) {
      return {
        title: nextProps.eventTitle,
      };
    } else {
      return {
        title: '',
      };
    }
  }

  handleTitleChange = event => {
    this.setState ({
      title: event.target.value,
    });
  };

  /**
   * Updates the event
   */
  handleOk = () => {
    this.props.onOk (this.state.title);
  };

  render () {
    const {title} = this.state;
    return (
      <Modal
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.props.onClose}
        footer={[
          <Button key="back" onClick={this.props.onCancel}>
            {this.props.editMode ? 'Delete' : 'Cancel'}
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleOk}>
            {this.props.editMode ? 'Update Lesson' : 'Add Lesson'}
          </Button>,
        ]}
      >
        <AddEvent
          title={title}
          onTitleChange={this.handleTitleChange}
          start={this.props.eventStart}
          end={this.props.eventEnd}
          onTimeChange={this.props.onTimeChange}
        />
      </Modal>
    );
  }
}

export default AddEventModal;
