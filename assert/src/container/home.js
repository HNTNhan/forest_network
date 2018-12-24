import { connect } from 'react-redux';
import Home from '../components/home';

const mapStateToProps = state => ({
        user: state.userReducer,
        post: state.postReducer
});

export default connect(
    mapStateToProps,
    null
)(Home);