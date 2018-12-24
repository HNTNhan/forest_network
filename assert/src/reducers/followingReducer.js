const initialState = [
    {
        username: 'Dinh Quan',
        description: 'He is fucking awesome. lorem asdfsdf asdfsdfsadfsfd',
        status: 'Following',
        headerImage: 'header1.jpg'

    },
    {
        username: 'Doan Son',
        description: 'lorem asdfsdf asdfsdfsadfsfd. He is a normal person',
        status: 'Following',
        headerImage: 'header.jpg'

    },
    {
        username: 'Ngoc Bui',
        description: 'He is  a leader of a tribal. He is fucking awesome. lorem asdfsdf asdfsdfsadfsfd. sdfsdfsdf',
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