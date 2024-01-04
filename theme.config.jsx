/* eslint-disable import/no-anonymous-default-export */

import { GhostLogo } from './src/assets/svgs/logos/ghost';

export default {
  logo: <GhostLogo className="w-32 h-auto" />,
  toc: { backToTop: true },
  feedback: { content: null },
  footer: {
    text: <span>All rights reserved {new Date().getFullYear()} © Ghost.</span>,
  },
  editLink: {
    component: null,
  },
  feedback: {
    content: null,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s',
    };
  },
};
