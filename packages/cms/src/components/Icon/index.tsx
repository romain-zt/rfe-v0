import React from 'react'

export const Icon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={20}
    height={20}
    aria-label="RFE"
  >
    <rect width="512" height="512" rx="108" fill="#070708" />
    <g
      fill="none"
      stroke="#B5975A"
      strokeWidth="26"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="256" y1="108" x2="256" y2="404" />
      <path d="M256 108 C172 108, 126 155, 126 196 C126 244, 174 272, 256 272" />
      <line x1="256" y1="272" x2="146" y2="404" />
      <line x1="256" y1="108" x2="374" y2="108" />
      <line x1="256" y1="256" x2="356" y2="256" />
    </g>
  </svg>
)
