import React from 'react';

const Svg = ({ children, className = 'w-6 h-6', strokeWidth = 1.8 }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const ShuffleIcon = (props) => (
  <Svg {...props}>
    <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.8-1.1 2-1.7 3.3-1.7H22" />
    <path d="m18 2 4 4-4 4" />
    <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
    <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
    <path d="m18 14 4 4-4 4" />
  </Svg>
);

export const ListIcon = (props) => (
  <Svg {...props}>
    <path d="M8.25 6.75h12M8.25 12h12M8.25 17.25h12" />
    <path d="M3.75 6.75h.008v.008H3.75zM3.75 12h.008v.008H3.75zM3.75 17.25h.008v.008H3.75z" strokeWidth={2.6} />
  </Svg>
);

export const FilterIcon = (props) => (
  <Svg {...props}>
    <path d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
  </Svg>
);

export const UsedIcon = (props) => (
  <Svg {...props}>
    <path d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4" />
    <path d="M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </Svg>
);

export const PlusIcon = (props) => (
  <Svg {...props}>
    <path d="M12 4.5v15m7.5-7.5h-15" />
  </Svg>
);

export const CloseIcon = (props) => (
  <Svg {...props}>
    <path d="M6 18 18 6M6 6l12 12" />
  </Svg>
);

export const ReturnIcon = (props) => (
  <Svg {...props}>
    <path d="M9 15 4 10l5-5" />
    <path d="M4 10h10.5a5.5 5.5 0 0 1 5.5 5.5V19" />
  </Svg>
);

export const ChevronIcon = (props) => (
  <Svg {...props}>
    <path d="m9 5 7 7-7 7" />
  </Svg>
);

export const CardStackIcon = (props) => (
  <Svg {...props}>
    <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10" />
  </Svg>
);
