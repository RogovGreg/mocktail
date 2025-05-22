export const MocktailLoadingIcon = () => (
  <svg height='200' viewBox='0 0 400 600' xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <clipPath id='clip-half'>
        <rect
          x='0'
          y='95'
          width='200'
          height='100'
          transform='rotate(-12, 80, 200)'
        />
      </clipPath>
    </defs>
    <circle cx='90' cy='190' r='88' fill='Gold' clipPath='url(#clip-half)' />
    <circle
      cx='90'
      cy='190'
      r='80'
      fill='LemonChiffon'
      clipPath='url(#clip-half)'
    />
    <line x1='115' y1='582' x2='362' y2='35' stroke='black' strokeWidth='12' />

    <polygon
      points='85,155 315,155 290,585 110,585'
      fill='lightgray'
      opacity='0.6'
    />

    <path opacity='0.8' d='M85,155 L315,155 L290,585 L110,585 Z' fill='aqua'>
      <animate
        attributeName='d'
        dur='2s'
        repeatCount='indefinite'
        values='
      M85,155 L315,155 L290,585 L110,585 Z;
      M110,585 L290,585 L290,585 L110,585 Z
      '
      />
    </path>
    <path
      d='M81,150.5 L319,150.5 L294,589 L106,589 Z'
      fill='none'
      stroke='darkgray'
      strokeOpacity='0.9'
      strokeWidth='9'
    />
    <rect
      x='200'
      y='495'
      width='90'
      height='90'
      rx='15'
      ry='15'
      fill='snow'
      style={{ opacity: 0.7 }}
    />
    <rect
      x='138.5'
      y='432'
      width='90'
      height='90'
      rx='15'
      ry='15'
      fill='snow'
      opacity='0.7'
      transform='rotate(35, 165, 445)'
    />
    <rect
      x='205'
      y='377.5'
      width='90'
      height='90'
      rx='15'
      ry='15'
      fill='snow'
      opacity='0.7'
      transform='rotate(15, 250, 415)'
    />
  </svg>
);
