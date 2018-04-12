import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import Card from '@youversion/melos/dist/components/containers/Card'
import Title from '@youversion/melos/dist/components/typography/Heading1'
import Body from '@youversion/melos/dist/components/typography/Body'
import { videoDetailsJson } from '../../api/video-api-mock'

const VIDEO_PLAYING = 0
const VIDEO_PAUSED = 1
const VIDEO_STOPPED = 2

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
			playbackState: VIDEO_STOPPED
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
		this.setState({ playbackState: VIDEO_PLAYING })
		this.videoRef.current.play()
	}

	pauseVideo() {
		if (this.state.playbackState === VIDEO_PLAYING) {
			this.videoRef.current.pause()
			this.setState({ playbackState: VIDEO_PAUSED })
		}
	}

	render() {
		const { video } = this.state
		return (
			<div>
				<Helmet>
					<title>{video.title} - {video.credits} | Videos | The Bible App | Bible.com</title>
					<meta name="description" content={`${video.title} - ${video.credits} | Videos`} />
				</Helmet>
				<Card>
					<Title>{video.title}</Title>
					<Video {...this} {...this.state} />
					<VideoControls {...this } {...this.state} />
					<Body>{video.publisher.description}</Body>
				</Card>
			</div>
		)
	}
}

VideoContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			topicId: PropTypes.string
		}).isRequired
	}).isRequired
}



const videoStyles = {
	videoContainer: {
		position: 'relative',
		height: 'auto',
		width: '100%'
	},
	bigPlayButton: {
		position: 'absolute',
		top: '45%',
		left: '45%',
		zIndex: '1',
		padding: '2em',
		borderRadius: '1em'
	},
	video: {
		width: '100%'
	}
}

const Video = ({
	playVideo, playbackState, video, videoRef
}) => {
	const bigPlayButton = playbackState === VIDEO_STOPPED ?
		<button onClick={playVideo} style={videoStyles.bigPlayButton} type="button" aria-label="play video">Play</button> : ''
	return (
		<div style={videoStyles.videoContainer}>
			{bigPlayButton}
			<video style={videoStyles.video} ref={videoRef} poster={video.poster}>
				{video.renditions.map((rendition) => {
					return <source key={`vr-${rendition.url}`}	src={rendition.url} type={`video/${rendition.format}`} />
				})}
				<track src="" />
			</video>
		</div>
	)
}

Video.propTypes = {
	playbackState: PropTypes.number.isRequired,
	playVideo: PropTypes.func.isRequired,
	videoRef: PropTypes.string.isRequired,
	video: PropTypes.objectOf({
		poster: PropTypes.string.isRequired,
		reditions: PropTypes.array.isRequired
	}).isRequired
}

const VideoControls = ({ playVideo, pauseVideo, playbackState }) => {
	const playPause = playbackState === VIDEO_PLAYING ? pauseVideo : playVideo
	return (
		<div>
			<button id="playpause" type="button" onClick={playPause}>Play/Pause</button>
			<div className="progress">
				<progress id="progress" value="0" min="0">
					<span id="progress-bar" />
				</progress>
			</div>
			<button id="mute" type="button" data-state="mute">Mute/Unmute</button>
			<button id="volinc" type="button" data-state="volup">Vol+</button>
			<button id="voldec" type="button" data-state="voldown">Vol-</button>
			<button id="fs" type="button" data-state="go-fullscreen">Fullscreen</button>
		</div>
	)
}

VideoControls.propTypes = {
	playbackState: PropTypes.number.isRequired,
	playVideo: PropTypes.func.isRequired,
	pauseVideo: PropTypes.func.isRequired
}

export default VideoContainer
