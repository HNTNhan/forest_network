import { connect } from 'react-redux';
import PostDetail from '../components/postdetail';

const mapStateToProps = state => ({
    post: state.postReducer
});

export default connect(
    mapStateToProps
)(PostDetail);