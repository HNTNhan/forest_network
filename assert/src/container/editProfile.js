import { connect } from 'react-redux';
import EditProfile from '../components/editprofile';
import { updateUser } from '../action/userActions'

const mapStateToProps = (state) => ({
    user: state.userReducer  
});

const mapDispatchToProps = dispatch => {
    return {
        onUpdate: (data) => dispatch(updateUser(data))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditProfile);