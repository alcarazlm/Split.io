import React, { useState } from "react";
import { DatePicker } from "@material-ui/pickers";
import {
  Typography, Grid, CardHeader, CardMedia, Card, CardContent, CardActionArea
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

class Calender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        userInfo: null,
        date: Date.now(),
        showModal: false,
        selected_dates: [],
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }
    
    componentDidMount() {
        axios.get(`/user/${this.props.match.params.userId}`).then((response) => {
            let user = response.data;
            this.setState({userInfo: user});
            this.setState({selected_dates: user.receipts?.map(r => r.date)});
        }).catch((err) => {console.log(err);});
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }
    
    handleCloseModal () {
        this.setState({ showModal: false });
    }
    
    changeDate(event) {
        this.setState({date: event})
    }
     render() {
        // const [date, changeDate] = useState(new Date());
        return (
                <DatePicker
                autoOk
                orientation="landscape"
                variant="static"
                openTo="date"
                value={this.state.date}
                onChange={() => this.changeDate(this.state.date)}
                // onMonthChange={handleMonthChange}
                // renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => {
                //     const isSelected = isInCurrentMonth && selectedDays.includes(date.getDate());
          
                //     // You can also use our internal <Day /> component
                //     return <Badge badgeContent={isSelected ? "🌚" : undefined}>{dayComponent}</Badge>;
                //   }}
            />
        )
    }

}

export default Calender;

