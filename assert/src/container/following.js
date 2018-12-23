import { connect } from 'react-redux';
import Following from '../components/following';

const mapStateToProps = state => ({
        user: state.userReducer,
        post: state.postReducer,
        following: state.followingReducer
});

export default connect(
    mapStateToProps,
    null
)(Following);