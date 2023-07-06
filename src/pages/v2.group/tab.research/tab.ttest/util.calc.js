import criticals from './criticals';

// ใช้งานได้ด้วย == (2020.03.29)
// //// P(T<=t) one-tail
// function ptOneTail (t, n)
// {
//     const PiD2 = Math.PI / 2;
    
//     function StatCom(q, i, j, b) {
//         var zz = 1; var z = zz; var k = i; while (k <= j) { zz = zz * q * k / (k - b); z = z + zz; k = k + 2 }
//         return z
//     }
    
//     // เรียกใช้ตัวนี้
//     function StudT(t, n) {
//         t = Math.abs(t); var w = t / Math.sqrt(n); var th = Math.atan(w)
//         if (n == 1) { return 1 - th / PiD2 }
//         var sth = Math.sin(th); var cth = Math.cos(th)
//         if ((n % 2) == 1) { return 1 - (th + sth * cth * StatCom(cth * cth, 2, n - 3, -1)) / PiD2 }
//         else { return 1 - sth * StatCom(cth * cth, 1, n - 3, -1) }
//     }

//     return StudT (t, n) / 2;
// }
// /////////

// /////////
// function ptTwoTail (t, n)
// {
//     const PiD2 = Math.PI / 2;

//     function StudT(t, n) {
//         t = Math.abs(t); var w = t / Math.sqrt(n); var th = Math.atan(w)
//         if (n == 1) { return 1 - th / PiD2 }
//         var sth = Math.sin(th); var cth = Math.cos(th)
//         if ((n % 2) == 1) { return 1 - (th + sth * cth * StatCom(cth * cth, 2, n - 3, -1)) / PiD2 }
//         else { return 1 - sth * StatCom(cth * cth, 1, n - 3, -1) }
//     }

//     function StatCom(q, i, j, b) {
//         var zz = 1; var z = zz; var k = i; while (k <= j) { zz = zz * q * k / (k - b); z = z + zz; k = k + 2 }
//         return z
//     }

//     return StudT (t, n);
// }
// /////////

//// P(T<=t) one-tail
function ptOneTail (t, n)
{
    const PiD2 = Math.PI / 2;
    
    function StatCom(q, i, j, b) {
        var zz = 1; var z = zz; var k = i; while (k <= j) { zz = zz * q * k / (k - b); z = z + zz; k = k + 2 }
        return z
    }
    
    // เรียกใช้ตัวนี้
    function StudT(t, n) {
        t = Math.abs(t); var w = t / Math.sqrt(n); var th = Math.atan(w)
        if (n === 1) { return 1 - th / PiD2 }
        var sth = Math.sin(th); var cth = Math.cos(th)
        if ((n % 2) === 1) { return 1 - (th + sth * cth * StatCom(cth * cth, 2, n - 3, -1)) / PiD2 }
        else { return 1 - sth * StatCom(cth * cth, 1, n - 3, -1) }
    }

    return StudT (t, n) / 2;
}
/////////

/////////
function ptTwoTail (t, n)
{
    const PiD2 = Math.PI / 2;

    function StudT(t, n) {
        t = Math.abs(t); var w = t / Math.sqrt(n); var th = Math.atan(w)
        if (n === 1) { return 1 - th / PiD2 }
        var sth = Math.sin(th); var cth = Math.cos(th)
        if ((n % 2) === 1) { return 1 - (th + sth * cth * StatCom(cth * cth, 2, n - 3, -1)) / PiD2 }
        else { return 1 - sth * StatCom(cth * cth, 1, n - 3, -1) }
    }

    function StatCom(q, i, j, b) {
        var zz = 1; var z = zz; var k = i; while (k <= j) { zz = zz * q * k / (k - b); z = z + zz; k = k + 2 }
        return z
    }

    return StudT (t, n);
}
/////////

/////////
function tcritical (v, a)
{
    let i = v - 1;

    if (i >= criticals.length)
    {
        i = criticals.length - 1;
    }

    const critical = criticals[i];

    if (a >= 0.999)
    {
        return critical['0.999'];
    }
    else if (a >= 0.995)
    {
        return critical['0.995'];
    }
    else if (a >= 0.99)
    {
        return critical['0.990'];
    }
    else if (a >= 0.975)
    {
        return critical['0.975'];
    }
    else if (a >= 0.95)
    {
        return critical['0.950'];
    }

    return critical['0.90'];
}
/////////

// function parseActives (students, tests)
// {
//     const result = {};

//     for (let i = 0; i < students.length; i++)
//     {
//         const id = students[i].id;
        
//         if (tests[id])
//         {
//             result[id] = tests[id];
//         }
//     }

//     return result;
// }

// function parseActives2 (students, pre, post)
// {
//     const pretests = {};
//     const posttests = {};

//     for (let i = 0; i < students.length; i++)
//     {
//         const id = students[i].id;
        
//         if (pre[id] && post[id])
//         {
//             pretests[id] = pre[id];
//             posttests[id] = post[id];
//         }
//     }

//     return { pretests, posttests };
// }

function normalize (students, pretests, posttests)
{
    const items = [];

    let sumX = 0;
    let sumXX = 0;
    let sumXY = 0;
    let sumY = 0;
    let sumYsubX = 0;
    let sumYY = 0;

    for (let i = 0; i < students.length; i++)
    {
        const id = students[i].id;

        if (pretests[id] && posttests[id])
        {
            const X = pretests[id].score || 0;
            const Y = posttests[id].score || 0;

            const XY = X * Y;
            const YsubX = Y - X;

            sumX += X;
            sumXX += X * X;
            sumXY += X * Y;
            sumY += Y;
            sumYY += Y * Y;
            sumYsubX += YsubX;

            items.push (
                {
                    id,

                    X,
                    XX: X * X,
                    XY,
                    Y,
                    YY: Y * Y,
                    YsubX,
                }
            )
        }
    }

    const N = items.length;

    const avgX = sumX / N;
    const avgY = sumY / N;
    const avgYsubX = sumYsubX / N;

    const result = 
    {
        rows: items,
        sum:
        {
            X: sumX,
            XX: sumXX,
            XY: sumXY,
            Y: sumY,
            YY: sumYY,
            YsubX: sumYsubX,
        },
        avg:
        {
            X: avgX,
            Y: avgY,
            YsubX: avgYsubX,
        },
    };

    let sumD = 0;
    let sumVX = 0;
    let sumVY = 0;

    for (let i = 0; i < result.rows.length; i++)
    {
        const { X, Y, YsubX } = result.rows[i];

        const D = (YsubX - avgYsubX) * (YsubX - avgYsubX);
        const VX = (X - avgX) * (X - avgX);
        const VY = (Y - avgY) * (Y - avgY); 

        result.rows[i].D = D;
        result.rows[i].VX = VX;
        result.rows[i].VY = VY;

        sumD += D;
        sumVX += VX;
        sumVY += VY;
    }

    result.sum.D = sumD;
    result.sum.VX = sumVX;
    result.sum.VY = sumVY;
    result.VX = sumVX / (N - 1);
    result.VY = sumVY / (N - 1);

    return result;
}

function ttest (students, pre, post)
{
    const table = normalize (students, pre, post);
    const result = {};

    for (let i = 0; i < table.rows.length; i++)
    {
        const row = table.rows[i];

        result[row.id] =
        {
            xy: row.XY,
            xx: row.XX,
            yy: row.YY,

            d: row.D,
        };
    }
    
    const N = table.rows.length;
    const df = Math.max (N - 1, 1);

    const s2d = (table.sum.D / df) / N;
    const sd = Math.sqrt (s2d);

    // const nx = count;
    // const ny = count;

    let t = table.avg.YsubX / sd;

    const p1 = ptOneTail (t, df);
    const p2 = ptTwoTail (t, df);

    const tCritical1 = parseFloat (tcritical (df, 0.95));
    const tCritical2 = parseFloat (tcritical (df, 0.975));

    // เหลือคำนวน pearson
    const ra = (N * table.sum.XY) - (table.sum.X * table.sum.Y);
    const rb = ((N * table.sum.XX) - (table.sum.X * table.sum.X)) * ((N * table.sum.YY) - (table.sum.Y * table.sum.Y));
    const r = ra / Math.sqrt (rb);
    //

    const sig = p1;

    const data = 
    {
        mean:
        {
            x: table.avg.X,
            y: table.avg.Y,
        },

        variance:
        {
            x: table.VX,
            y: table.VY,
        },

        observations:
        {
            x: N - 1,
            y: N - 1,
        },

        n:
        {
            x: N,
            y: N,
        },

        hypo: 0,
        df,
        t,
        sig,

        pearson: r || 0,

        p1t: p1,
        p2t: p2,

        tc1t: tCritical1,
        tc2t: tCritical2,
    };

    return {
        students: result,
        ttest: data,
    }

    /*
    // pretests = parseActives (students, pretests);
    // posttests = parseActives (students, posttests);

    const { pretests, posttests } = parseActives2 (students, pre, post);

    const nx = Object.keys (pretests).length;
    const ny = Object.keys (posttests).length;

    let sumX = 0;
    let sumY = 0;
    let sumY_X = 0;

    for (let i = 0; i < students.length; i++)
    {
        const id = students[i].id;

        const pre = pretests[id] || {};
        const post = posttests[id] || {};

        const x = pre.score || 0;
        const y = post.score || 0;

        sumY_X += (y - x);
    }

    for (let id in pretests)
    {
        sumX += pretests[id].score || 0;
    }

    for (let id in posttests)
    {
        sumY += posttests[id].score || 0;
    }

    // const count = students.length;
    const count = ny;

    const avgX = sumX / nx;
    const avgY = sumY / ny;

    // const avgD = avgY - avgX;
    const avgD = sumY_X / ny;

    const result = {};

    let sx = 0;
    let sy = 0;
    let d = 0;

    let sumXX = 0;
    let sumYY = 0;
    let sumXY = 0;

    for (let i = 0; i < students.length; i++)
    {
        const id = students[i].id;

        const pre = pretests[id] || {};
        const post = posttests[id] || {};

        const x = pre.score || 0;
        const y = post.score || 0;

        const sxi = (x - avgX) * (x - avgX);
        const syi = (y - avgY) * (y - avgY);

        const di = ((y - x) - avgD) * ((y - x) - avgD);

        sx += sxi;
        sy += syi;

        d += di;

        sumXX += (x * x);
        sumYY += (y * y);
        sumXY += (x * y);

        result[id] =
        {
            xy: x * y,
            xx: x * x,
            yy: y * y,

            d,
        };
    }
    
    const df = Math.max (ny - 1, 1);

    sx = sx / (nx - 1);
    sy = sy / (ny - 1);

    const s2d = (d / df) / ny;
    const sd = Math.sqrt (s2d);

    // const nx = count;
    // const ny = count;

    let t = avgD / sd;

    // if (!Number.isSafeInteger (t))
    // {
    //     t = 0;
    // }

    const p1 = ptOneTail (t, df);
    const p2 = ptTwoTail (t, df);

    const tCritical1 = parseFloat (tcritical (df, 0.95));
    const tCritical2 = parseFloat (tcritical (df, 0.975));

    // เหลือคำนวน pearson
    const ra = (count * sumXY) - (sumX * sumY);
    const rb = ((count * sumXX) - (sumX * sumX)) * ((count * sumYY) - (sumY * sumY));
    const r = ra / Math.sqrt (rb);
    //

    const sig = p1;

    const data = 
    {
        mean:
        {
            x: avgX,
            y: avgY,
        },

        variance:
        {
            x: sx,
            y: sy,
        },

        observations:
        {
            x: nx,
            y: ny,
        },

        hypo: 0,
        df,
        t,
        sig,

        pearson: r || 0,

        p1t: p1,
        p2t: p2,

        tc1t: tCritical1,
        tc2t: tCritical2,
    };

    return {
        students: result,
        ttest: data,
    }
    */
}

export default
{
    ttest,
}