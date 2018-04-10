import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import Card from '@youversion/melos/dist/components/containers/Card'
import Title from '@youversion/melos/dist/components/typography/Heading1'
import Body from '@youversion/melos/dist/components/typography/Body'
import { videoDetailsJson } from '../../api/video-api-mock'

class VideoContainer extends React.Component {

	static findBestThumbnailForVideoPoster(videoData) {
		let poster = '', currentHeight = 0, currentWidth = 0

		videoData.thumbnails.forEach(thumbnail => {
			if (thumbnail.height > currentHeight && thumbnail.width > currentWidth) {
				poster = thumbnail.url
				currentHeight = thumbnail.height
				currentWidth = thumbnail.width
			}
		})
		return poster
	}

	constructor(props) {
		super(props)
		this.state = {
			video: {},
			videoIsPlaying: false
		}
		this.videoRef = React.createRef()
		this.playVideo = this.playVideo.bind(this)
		this.pauseVideo = this.pauseVideo.bind(this)
	}

	componentWillMount() {
		const videoData = videoDetailsJson.response.data
		this.setState({
			video: {
				...videoData,
				poster: VideoContainer.findBestThumbnailForVideoPoster(videoData)
			}
		})
	}

	playVideo() {
		this.setState({ videoIsPlaying: true })
		this.videoRef.current.play()
	}

	pauseVideo() {
		if (this.state.videoIsPlaying) {
			this.videoRef.current.pause()
			this.setState({ videoIsPlaying: false })
		}
	}

	render() {
		const { video, videoIsPlaying } = this.state
		return (
			<div>
				<Helmet>
					<title>{video.title} - {video.credits} | Videos | The Bible App | Bible.com</title>
					<meta name="description" content={`${video.title} - ${video.credits} | Videos`} />
				</Helmet>

				<Card>
					<Title>{video.title}</Title>
					<video ref={this.videoRef} height={500} width={500} controls poster={video.poster}>
						{video.renditions.map((rendition) => {
							return <source key={`vr-${rendition.url}`}	src={rendition.url} type={`video/${rendition.format}`} />
						})}
						<track src="" />
					</video>
					<VideoControls {...this} videoIsPlaying={videoIsPlaying} />
					<Body>{video.publisher.description}</Body>
				</Card>
			</div>
		)
	}
}

const VideoControls = ({ playVideo, pauseVideo, videoIsPlaying }) => {
	const playPause = videoIsPlaying ? pauseVideo : playVideo
	return (
		<div>
			<button id="playpause" type="button" onClick={playPause}>Play/Pause</button>
			<button id="stop" type="button" data-state="stop">Stop</button>
			<div class="progress">
				<progress id="progress" value="0" min="0">
					<span id="progress-bar"></span>
				</progress>
			</div>
			<button id="mute" type="button" data-state="mute">Mute/Unmute</button>
			<button id="volinc" type="button" data-state="volup">Vol+</button>
			<button id="voldec" type="button" data-state="voldown">Vol-</button>
			<button id="fs" type="button" data-state="go-fullscreen">Fullscreen</button>
		</div>
	)
}

VideoContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			topicId: PropTypes.string
		}).isRequired
	}).isRequired
}

VideoControls.propTypes = {
	videoIsPlaying: PropTypes.bool.isRequired,
	playVideo: PropTypes.func.isRequired,
	pauseVideo: PropTypes.func.isRequired
}

export default VideoContainer
