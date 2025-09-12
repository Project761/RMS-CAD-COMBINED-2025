import { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { IncidentContext } from '../../../CADContext/Incident';

const DateTimeCounter = ({ data }) => {
    const { offset } = useContext(IncidentContext);
    const [time, setTime] = useState("");

    const dateTimer = (date) => {
        if (!offset) {
            return "";
        }

        const dataMoment = moment(date);
        const pastDate = dataMoment.add(offset * -1, 'm');
        const currentDate = moment().utc().add(new Date().getTimezoneOffset(), 'm');
        const duration = moment.duration(currentDate.diff(pastDate));

        if (duration.asSeconds() < 0) {
            return ""; // If the time difference is negative, return an empty string
        }

        const hours = Math.floor(duration.asHours()).toString().padStart(2, '0');
        const minutes = Math.floor(duration.asMinutes() % 60).toString().padStart(2, '0');
        const seconds = Math.floor(duration.asSeconds() % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => {
        if (offset) {
            const interval = setInterval(() => {
                const newTime = data ? dateTimer(data) : "";
                setTime(newTime);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [data, offset]);

    return (
        <div>
            {time}
        </div>
    );
};

export default DateTimeCounter;

// PropTypes definition
DateTimeCounter.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

// Default props
DateTimeCounter.defaultProps = {
  data: null
};
