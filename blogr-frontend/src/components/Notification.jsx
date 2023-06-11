import PropTypes from 'prop-types'

const Notification = ({ message, messageType }) => (
  <div className={messageType}>
    <p>{message}</p>
  </div>
)

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  messageType: PropTypes.string.isRequired
}

export default Notification