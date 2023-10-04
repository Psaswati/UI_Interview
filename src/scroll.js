import React, { Component } from 'react';

class InfiniteScroll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            page: 1,
            loading: false,
        };
    }

    componentDidMount() {
        this.loadArticles();
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    loadArticles = () => {
        const { nodes, page, loading } = this.state;

        if (loading) return;

        this.setState({ loading: true });

        fetch(`https://englishapi.pinkvilla.com/app-api/v1/photo-gallery-feed-page/page/${page}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log(data)
                const newArticles = data.nodes;

                if (newArticles && newArticles.length > 0) {
                    this.setState({
                        nodes: [...nodes, ...newArticles],
                        page: page + 1,
                        loading: false,
                    });
                } else {
                    this.setState({ loading: true }); // No more data available
                }
            })
            .catch((error) => {
                console.error('Error loading articles:', error);
                this.setState({ loading: false });
            });
    };

    handleScroll = () => {
        const { loading } = this.state;

        if (loading) return;

        if (
            window.innerHeight + window.scrollY >=
            document.documentElement.offsetHeight
        ) {
            this.loadArticles();
        }
    };

    render() {
        const { nodes, loading } = this.state;
        console.log('inside render', nodes);
        return (
            <div className="infinite-scroll">
                {nodes.map((node, index) => (
                    <div key={index} className="row m-3">
                        <img className='h-50 w-50 col-4' src={node.node.field_photo_image_section} />
                        <div className='col-6'>
                            <h2>{node.node.title}</h2>
                            <p>Last Update: {node.node.last_update}</p>
                        </div>
                    </div>
                ))}
                {loading && <p>Loading...</p>}
            </div>
        );
    }
}

export default InfiniteScroll;
