const initialState = [
    {
        username: 'Mr X',
        description: 'Page is special for Ngoc Bui. lorem asdfsdf asdfsdfsadfsfd',
        status: 'Following',
        headerImage: 'header1.jpg'

    },
    {
        username: 'Mr Gay',
        description: 'Provide infor about men for Ngox. He is a normal person',
        status: 'Following',
        headerImage: 'header.jpg'

    },
    {
        username: 'Mr Boy',
        description: 'Ngoc Bui often accesses this page. He is fucking awesome. lorem asdfsdf asdfsdfsadfsfd. sdfsdfsdf',
        status: 'Following',
        headerImage: 'header2jpg.jpg'


    }
];

export default (state = initialState, action) => {
    switch(action.type) {
        default:
        return state;
    }
}