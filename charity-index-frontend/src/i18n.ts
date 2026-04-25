import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import uzCommon from './locales/uz/common.json';
import uzNav from './locales/uz/nav.json';
import uzHome from './locales/uz/home.json';
import uzFooter from './locales/uz/footer.json';
import uzFunds from './locales/uz/funds.json';
import uzRanking from './locales/uz/ranking.json';
import uzAuth from './locales/uz/auth.json';
import uzBoglanish from './locales/uz/boglanish.json';
import uzHamkorlik from './locales/uz/hamkorlik.json';
import uzCompare from './locales/uz/compare.json';
import uzNews from './locales/uz/news.json';
import uzFundDetail from './locales/uz/fund_detail.json';
import uzTadqiqot from './locales/uz/tadqiqot.json';

import ruCommon from './locales/ru/common.json';
import ruNav from './locales/ru/nav.json';
import ruHome from './locales/ru/home.json';
import ruFooter from './locales/ru/footer.json';
import ruFunds from './locales/ru/funds.json';
import ruRanking from './locales/ru/ranking.json';
import ruAuth from './locales/ru/auth.json';
import ruBoglanish from './locales/ru/boglanish.json';
import ruHamkorlik from './locales/ru/hamkorlik.json';
import ruCompare from './locales/ru/compare.json';
import ruNews from './locales/ru/news.json';
import ruFundDetail from './locales/ru/fund_detail.json';

import enCommon from './locales/en/common.json';
import enNav from './locales/en/nav.json';
import enHome from './locales/en/home.json';
import enFooter from './locales/en/footer.json';
import enFunds from './locales/en/funds.json';
import enRanking from './locales/en/ranking.json';
import enAuth from './locales/en/auth.json';
import enBoglanish from './locales/en/boglanish.json';
import enHamkorlik from './locales/en/hamkorlik.json';
import enCompare from './locales/en/compare.json';
import enNews from './locales/en/news.json';
import enFundDetail from './locales/en/fund_detail.json';
import enTadqiqot from './locales/en/tadqiqot.json';
import uzNotFound from './locales/uz/notFound.json';
import enNotFound from './locales/en/notFound.json';
import uzProfile from './locales/uz/profile.json';
import enProfile from './locales/en/profile.json';
import uzMetodologiya from './locales/uz/metodologiya.json';
import enMetodologiya from './locales/en/metodologiya.json';

i18n.use(initReactI18next).init({
  resources: {
    uz: {
      common: uzCommon,
      nav: uzNav,
      home: uzHome,
      footer: uzFooter,
      funds: uzFunds,
      ranking: uzRanking,
      auth: uzAuth,
      boglanish: uzBoglanish,
      hamkorlik: uzHamkorlik,
      compare: uzCompare,
      news: uzNews,
      fund_detail: uzFundDetail,
      tadqiqot: uzTadqiqot,
      notFound: uzNotFound,
      profile: uzProfile,
      metodologiya: uzMetodologiya,
    },
    ru: {
      common: ruCommon,
      nav: ruNav,
      home: ruHome,
      footer: ruFooter,
      funds: ruFunds,
      ranking: ruRanking,
      auth: ruAuth,
      boglanish: ruBoglanish,
      hamkorlik: ruHamkorlik,
      compare: ruCompare,
      news: ruNews,
      fund_detail: ruFundDetail,
    },
    en: {
      common: enCommon,
      nav: enNav,
      home: enHome,
      footer: enFooter,
      funds: enFunds,
      ranking: enRanking,
      auth: enAuth,
      boglanish: enBoglanish,
      hamkorlik: enHamkorlik,
      compare: enCompare,
      news: enNews,
      fund_detail: enFundDetail,
      tadqiqot: enTadqiqot,
      notFound: enNotFound,
      profile: enProfile,
      metodologiya: enMetodologiya,
    },
  },
  lng: localStorage.getItem('ciu_lang') || 'uz',
  fallbackLng: 'uz',
  ns: ['common', 'nav', 'home', 'footer', 'funds', 'ranking', 'auth', 'boglanish', 'hamkorlik', 'compare', 'news', 'fund_detail', 'tadqiqot', 'notFound', 'profile', 'metodologiya'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

export default i18n;
