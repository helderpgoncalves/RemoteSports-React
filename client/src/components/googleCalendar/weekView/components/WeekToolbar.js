import {Row, Col, Tooltip} from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import React from 'react';
import Button from "@material-ui/core/Button"
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import {
  toolbar,
  toolbarDate,
  appTitle,
  alignRight,
  spacify,
  weekButtons,
} from '../styles';
import moment from 'moment';

function WeekToolbar (props) {
  const formattedDate = moment (props.startDate).format ('MMM YYYY');
  return (
    <Row type="flex" gutter={4} style={toolbar}>
      <Col span={6} offset={3} style={appTitle}>
        <CalendarOutlined/> <br /> Classes Schedule <p style={{opacity: 0.54}}>{formattedDate}</p>
      </Col>
      <Col span={4} offset={8} style={alignRight}>
        <Tooltip placement="topLeft" title={moment ().format ('dddd, MMM D')}>
          <Button variant="contained" color="primary" onClick={props.goToToday}>Today</Button>
        </Tooltip>
      </Col>
      <Col span={2} style={weekButtons}>
        <Button variant="contained" color="secondary" onClick={props.goToPreviousWeek} startIcon={<NavigateBeforeIcon />}>LEFT</Button>
        <Button variant="contained" color="secondary" onClick={props.goToNextWeek} startIcon={<NavigateNextIcon/>}>RIGHT</Button>
      </Col>
    </Row>
  );
}

export default WeekToolbar;
