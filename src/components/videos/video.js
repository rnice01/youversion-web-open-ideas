import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { videoDetailsJson } from '../../api/video-api-mock'

class VideoContainer extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			video: {}
		}
	}

	componentWillMount() {
		const videoData = videoDetailsJson.response.data
		this.setState({video: videoData})
	}

	componentDidMount() {
	}

	render() {
		const { video } = this.state
		return (
			<div>
				<Helmet>
					<title>{video.title} - {video.credits} | Videos | The Bible App | Bible.com</title>
					<meta name="description" content={`${video.title} - ${video.credits} | Videos`} />
				</Helmet>

				<Video ref="video-player" {...this.props} video={video} />
			</div>
		)
	}
}

const Video = ({ match, video }) => {

	return (
		<div>

			<h2>This is the <q>{match.params.slug}</q> video</h2>
			<video height={500} width={500} controls>
				{video.renditions.map((rendition, i) => {
					return <source key={`vr-${rendition.url}`}	src={rendition.url} type={`video/${rendition.format}`} />
				})}
				<track src="" />
			</video>
		</div>
	)
}

Video.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			topicId: PropTypes.string
		})
	}).isRequired
}

export default VideoContainer
