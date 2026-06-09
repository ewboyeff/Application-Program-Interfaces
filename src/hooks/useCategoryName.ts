import { useTranslation } from 'react-i18next';
import { useCategoryStore } from '@/src/store/useCategoryStore';

export function useCategoryName() {
  const { t, i18n } = useTranslation('common');
  const { categories } = useCategoryStore();

  return (nameUz: string): string => {
    const cat = categories.find((c) => c.name_uz === nameUz);

    if (i18n.language === 'en') {
      if (cat?.name_en) return cat.name_en;
      const loc = t(`categories.${nameUz}`, { defaultValue: '' });
      if (loc) return loc;
    }
    if (i18n.language === 'ru') {
      if (cat?.name_ru) return cat.name_ru;
      const loc = t(`categories.${nameUz}`, { defaultValue: '' });
      if (loc) return loc;
    }

    return nameUz;
  };
}
