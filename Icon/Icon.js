var Icon = React.createClass({
    getInitialState: function() {
        return {
            name: this.props.name
        };
    },
    render: function() {
        var c = "iconfont icon-" + this.state.name;
        return (
            <i className={c}></i>
        );
    }
});

module.exports = Icon;