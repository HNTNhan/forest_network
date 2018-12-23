import { connect } from 'react-redux';
import UserProfile from '../components/userprofile';

const mapStateToProps = (state) => ({
    user: state.userReducer  
})

export default connect(
    mapStateToProps,
    {}
)(UserProfile);