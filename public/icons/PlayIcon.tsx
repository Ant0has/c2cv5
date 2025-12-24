const PlayIcon = () => {
    return (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="40" fill="url(#paint0_radial_1_2)" />
            <path d="M52 40L34 52V28L52 40Z" fill="white" />
            <defs>
                <radialGradient id="paint0_radial_1_2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(40 40) rotate(90) scale(40)">
                    <stop stop-color="#FF9C00" />
                    <stop offset="1" stop-color="#FF7A00" />
                </radialGradient>
            </defs>
        </svg>
    )
}

export default PlayIcon;