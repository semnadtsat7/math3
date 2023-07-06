import { useState, useEffect, useContext } from 'react';
import Local from 'localforage';

import * as Api from '../../../../utils/QueryAPI';
import { RootContext } from '../../../../root';

export type ListenQuizOptions =
  {
    quizID: string;
  }

export type Quiz = 
  {
    _id: string;
    title: string;
    level: string;
    order: number;
    scale: string;
    purpose: string;
    indicator: string;
    questions: Question[];
  }

export type Question = 
  {
    type: string;
    title: string;
    description: string;
    image: string;
    answer: string;
    choices: string;

    cellPerRow: number;
    cellType: string;

    hintText: string;
    hintImage: string;
  }

export type ListenQuizResult =
  {
    cacheID: string;

    fetching: 'full' | 'partial' | 'none';

    quiz: Quiz;
    version: string;
  }

const KEY = 'view-quiz';
const VERSION = 1;

function useHook (options: ListenQuizOptions)
{
  const { quizID } = options;
  const { version } = useContext(RootContext);

  const [view, setView] = useState<ListenQuizResult>(
    {
      cacheID: '',

      fetching: 'full',
      version: '',

      quiz:
      {
        _id: '',
        title: '',
        level: '',
        scale: '',
        purpose: '',
        indicator: '',
        order: 0,
        questions: [],
      }
    }
  );

  async function handleDownloadAsync ()
  {
    if (!quizID || !version.global)
    {
      return;
    }

    const cacheID = KEY + '-' + quizID + '-' + VERSION;
    const cached = await Local.getItem<ListenQuizResult>(cacheID);

    if (cached)
    {
      setView(cached);
    }
    else if (view.fetching === 'none')
    {
      setView({ ...view, fetching: 'full' });
    }

    if (!cached || cached.version !== version.global)
    {
      const payload = 
      {
        name: 'quiz',
        data: { quizID },
      };

      const quiz = await Api.exec('page_v2', payload);

      const newView: ListenQuizResult =
      {
        cacheID,

        fetching: 'none',
        version: version.global,
        
        quiz,
      };

      setView(newView);

      if (view.cacheID === newView.cacheID)
      {
        await Local.removeItem(view.cacheID);
      }
      
      await Local.setItem(newView.cacheID, newView);
    }
  }

  function handleDownload ()
  {
    handleDownloadAsync().then();
  }

  useEffect(handleDownload, [version.global, quizID]);

  return {
    view,
  };
}

export default useHook;