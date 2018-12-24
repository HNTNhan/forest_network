import { connect } from 'react-redux';
import Follower from '../components/follower';

const mapStateToProps = state => ({
        user: state.userReducer,
        post: state.postReducer,
        follower: state.followerReducer
});

export default connect(
    mapStateToProps,
    null
)(Follower);