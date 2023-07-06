import React, { useMemo } from 'react';
import styled from 'styled-components';

import { COLORS } from '../constants';

import NumberUtil from '../../../../utils/NumberTS';

import { ListenProgressResult } from './listenProgress';

import Card from '../Card';

const Container = styled.div`
  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;

  padding: 8px;

  @media (min-width: 576px)
  {
    flex-direction: column;
    align-items: center;
  }
`;

const First = styled.div`
  display: flex;

  flex-direction: column;
  flex-wrap: nowrap;

  align-items: center;

  svg
  {
    width: 100px;
    height: 100px;
  }

  @media (min-width: 375px)
  {
    svg
    {
      width: 120px;
      height: 120px;
    }
  }

  @media (min-width: 576px)
  {
    svg
    {
      width: 160px;
      height: 160px;
    }
  }
`;

const Second = styled.div`
  width: 100%;

  display: flex;

  flex-direction: column;
  flex-wrap: nowrap;
  flex-shrink: 1;

  align-items: stretch;
  justify-content: center;

  p
  {
    margin: 10px auto;
  }

  ul
  {
    font-size: 0.9em;

    padding-inline-start: 30px;
    margin: 0;
  }

  li
  {
    margin: 8px 0;
  }

  @media (min-width: 375px)
  {
    ul
    {
      padding-inline-start: 40px;
    }
  }
`;

interface Props
{
  view: ListenProgressResult;
}

function parse (view: ListenProgressResult)
{
  if (view.fetching === 'full')
  {
    return {
      pass: 0,
      not: 0,
    };
  }

  // const { pass, quiz } = view.total.metrics;
  const pass = Math.floor(view.total.metrics.pass);
  const quiz = view.total.metrics.quiz;

  return { 
    pass: pass,
    not: quiz - pass,
  };
}

function percentage (value: number, max: number)
{
  return (value / max) * 100;
}

function arc (c: number, r: number, offset: number, percentage: number)
{
  const cos = Math.cos;
  const sin = Math.sin;
  const π = Math.PI;

  const rad = (π / 180);

  const step = 360 / 100;
  const p = 270 * rad;

  const t = offset * step * rad;
  const d = percentage * step * rad;

  const f_matrix_times = (( [[a,b], [c,d]]: any[], [x,y]: any[]) => [ a * x + b * y, c * x + d * y]);
  const f_rotate_matrix = ((x: any) => [[cos(x),-sin(x)], [sin(x), cos(x)]]);
  const f_vec_add = (([a1, a2]: any[], [b1, b2]: any[]) => [a1 + b1, a2 + b2]);

  const f_svg_ellipse_arc = (([cx,cy]: any[],[rx,ry]: any[], [t1, Δ]: any[], φ: any ) => 
  {
    /* [
    returns a SVG path element that represent a ellipse.
    cx,cy → center of ellipse
    rx,ry → major minor radius
    t1 → start angle, in radian.
    Δ → angle to sweep, in radian. positive.
    φ → rotation on the whole, in radian
    url: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
    Version 2019-06-19
     ] */

    Δ = Δ % (2*π);
    const rotMatrix = f_rotate_matrix (φ);

    const [sX, sY] = ( f_vec_add ( f_matrix_times ( rotMatrix, [rx * cos(t1), ry * sin(t1)] ), [cx,cy] ) );
    const [eX, eY] = ( f_vec_add ( f_matrix_times ( rotMatrix, [rx * cos(t1+Δ), ry * sin(t1+Δ)] ), [cx,cy] ) );
  
    const fA = ( (  Δ > π ) ? 1 : 0 );
    const fS = ( (  Δ > 0 ) ? 1 : 0 );

    return "M " + sX + " " + sY + " A " + [ rx , ry , φ / (2*π) *360, fA, fS, eX, eY ].join(" ");
  });
    
  return f_svg_ellipse_arc([c, c], [r, r], [t, d], p);
}

// const r = 15.91549430918954;
const r = 30;
const width = 15;
// const viewport = 100;
const center = 50;//viewport / 2;
const offset = 0.5;

const Comp: React.FC<Props> = (
  {
    view,
  }
) =>
{
  const { pass, not } = useMemo(() => parse(view), [view]);

  const quiz = view.total.metrics.quiz;
  const passP = useMemo(() => percentage(pass, quiz), [pass, quiz]);
  const notP = useMemo(() => percentage(not, quiz), [not, quiz]);

  return (
    <Card>
      <label>จำนวนด่านที่ผ่านโดยเฉลี่ย ต่อ ด่านทั้งหมด ({NumberUtil.prettify(quiz)} ด่าน)</label>

      <Container>
        <First>
          <svg
            viewBox={`0 0 100 100`}
          >
            {
              view.fetching === 'full' ?
              <circle
                className="ring"
                cx={center}
                cy={center}
                r={r}
                fill="transparent"
                stroke="#d2d3d4"
                strokeWidth={width}
                pathLength={100}
              />
              :
              <>
                {
                  pass > 0 ?
                  <>
                    <path 
                      id="progress-by-sheets-total-pass"
                      d={arc(center, r, 0 + offset, passP - offset)} 
                      fill="transparent"
                      stroke={COLORS[0]}
                      strokeWidth={width}
                    />
                    <path 
                      id="progress-by-sheets-total-not-pass"
                      d={arc(center, r, passP + offset, notP - offset)} 
                      fill="transparent"
                      stroke={COLORS[1]}
                      strokeWidth={width}
                    />
                  </>
                  :
                  <circle
                    id="progress-by-sheets-total-not-pass"
                    className="ring"
                    cx={center}
                    cy={center}
                    r={r}
                    fill="transparent"
                    stroke={COLORS[1]}
                    strokeWidth={width}
                    pathLength={100}
                  />
                }

                
                <text
                  x="50%"
                  y="50%"
                  fill={COLORS[0]}
                  textAnchor="middle"
                  fontSize="0.8em"
                  fontFamily="sans-serif"
                  style={{ transform: 'translateY(4px)' }}
                >
                  {NumberUtil.prettifyF(passP, 1)}%
                </text>

                {/* <text
                  dy={-10}
                  letterSpacing={-1}
                  fill={COLORS[0]}
                  fontFamily="sans-serif"
                  fontSize="10px"
                >
                  <textPath
                    xlinkHref="#progress-by-sheets-total-pass"
                    textAnchor="middle"
                    startOffset="50%"
                  >
                    {NumberUtil.prettifyF(passP, 1)}%
                  </textPath>
                </text>

                <text
                  dy={-10}
                  letterSpacing={-1}
                  fill={COLORS[1]}
                  fontFamily="sans-serif"
                  fontSize="10px"
                >
                  <textPath
                    xlinkHref="#progress-by-sheets-total-not-pass"
                    textAnchor="start"
                    startOffset="5%"
                  >
                    {NumberUtil.prettifyF(notP, 1)}%
                  </textPath>
                </text> */}

                {/* <circle
                  data-id="pass"
                  className="segment"
                  cx={center}
                  cy={center}
                  r={r}
                  fill="transparent"
                  stroke={COLORS[0]}
                  strokeWidth={width}
                  strokeDasharray={`${passP - offset} ${notP + offset}`}
                  strokeDashoffset={25}
                  pathLength={100}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onMouseOver={handleMouseOver}
                />
                <circle
                  data-id="not"
                  className="segment"
                  cx={center}
                  cy={center}
                  r={r}
                  fill="transparent"
                  stroke={COLORS[1]}
                  strokeWidth={width}
                  strokeDasharray={`${notP - offset} ${passP + offset}`}
                  strokeDashoffset={25 - passP}
                  pathLength={100}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onMouseOver={handleMouseOver}
                /> */}
              </>
            }
          </svg>
        </First>
        <Second>
          {
            view.fetching === 'full' ?
            <p>
              กำลังโหลด ...
            </p>
            :
            <ul>
              <li style={{ color: COLORS[0] }} >
                <strong>ผ่านแล้ว <big>{NumberUtil.prettifyF(pass, 1)}</big> ด่าน</strong>
                <br />({NumberUtil.prettifyF(passP, 1)}%)
              </li>
              <li style={{ color: COLORS[1] }} >
                <strong>ยังไม่ผ่าน <big>{NumberUtil.prettifyF(not, 1)}</big> ด่าน</strong>
                <br />({NumberUtil.prettifyF(notP, 1)}%)
              </li>
            </ul>
          }
        </Second>
      </Container>
    </Card>
  );
}

export default Comp;