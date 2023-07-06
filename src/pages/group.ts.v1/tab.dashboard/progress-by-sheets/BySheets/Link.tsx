import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import querystring from 'querystring';

import { Button } from 'antd';

interface Props
{
  sheetID: string;
}

const Comp: React.FC<Props> = (
  {
    sheetID,
  }
) =>
{
  const location = useLocation();
  const query = querystring.parse(location.search.slice(1));

  const pathname = location.pathname;
  const student = query.student as string;
  const tab = 'summary';

  const href = pathname + '?' + querystring.stringify({ tab, sheetID, student });

  return (
    <Link to={href} >
      <Button
        type="primary"
        ghost={true}
        block={true}
      >
        รายละเอียด
      </Button>
    </Link>
  );
}

export default Comp;