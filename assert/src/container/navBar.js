import { connect } from 'react-redux';
import NavBar from '../components/navbar';

const mapStateToProps = (state) => ({
    user: state.userReducer  
})

export default connect(
    mapStateToProps,
    {}
)(NavBar);