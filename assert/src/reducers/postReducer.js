const initialState = [
  {
    id: 1,
    username: 'Ngoc bui',
    heading: "Media heading 1",
    content:
      "Media heading 1 Dolorem aspernatur rerum, iure? Culpa iste aperiam sequi, fuga, quasi rerum, eum, quo natus tenetur officia placeatThread! There's still time to support our 5 featured #YouTubeGiving charities—click the button to the right of each video to make a difference in someone's life. Imagine if you couldn’t watch the videos you love. We support copyright reform with an Article 13 that works for everyone.."
  },
  {
    id: 2,
    username: 'Doan Son',
    heading: "Media heading 2",
    content:
      "Thread! There's still time to support our 5 featured #YouTubeGiving charities—click the  button to the right of each video to make a difference in someone's life. Imagine if you couldn’t watch the videos you love. We support copyright reform with an Article 13 that works for everyone"
     +" Media heading 2 Dolorem aspernatur rerum, iure? Culpa iste aperiam sequi, fuga, quasi rerum, eum, quo natus tenetur officia placeat."
  },
  {
    id: 3,
    username: 'Dinh Quan',
    heading: "Media heading 3",
    content:
      "Thread! There's still time to support our 5 featured #YouTubeGiving charities—click the  button to the right of each video to make a difference in someone's life. Imagine if you couldn’t watch the videos you love. We support copyright reform with an Article 13 that works for everyone."
  }
];


export default (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
}