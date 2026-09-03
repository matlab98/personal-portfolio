import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import FullPageState from '@/components/FullPageState';
import Home from '@/pages/Home';
import { getCollectionData } from '@/firebase/firebase.config';

/**
 * Orquestador de datos: trae el documento del CMS y resuelve
 * `loading | empty | error | ready`. La composición visual vive en `Home`.
 */
function App() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loadState, setLoadState] = useState('loading');

  const dataFetch = useCallback(async () => {
    setLoadState('loading');
    try {
      const snapshot = await getCollectionData();
      // El CMS es un documento único: mapear la colección duplicaba la página.
      const [document] = snapshot.docs.map((item) => item.data());

      setData(document ?? null);
      setLoadState(document ? 'ready' : 'empty');
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    dataFetch();
  }, [dataFetch]);

  if (loadState === 'loading') {
    return <FullPageState loading />;
  }

  if (loadState === 'error' || loadState === 'empty') {
    return (
      <FullPageState
        message={t(loadState === 'error' ? 'app.load_error' : 'app.empty')}
        actionLabel={t('app.retry')}
        onAction={dataFetch}
      />
    );
  }

  return <Home data={data} />;
}

export default App;
