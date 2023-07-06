import React, { Component } from 'react';
import styled from 'styled-components';

import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';

class BarChart extends Component 
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            size: [ 500, 500 ],
        };
        
        this.createBarChart = this.createBarChart.bind(this);
    }

    componentDidMount() 
    {
        if(this.container)
        {
            const rect = this.container.getBoundingClientRect();
            this.setState({ size: [ rect.width, rect.height ] });
        }

        this.createBarChart();
    }

    componentDidUpdate() 
    {
        this.createBarChart();
    }

    createBarChart() 
    {
        let size = this.state.size;
        
        if(this.container)
        {
            const rect = this.container.getBoundingClientRect();
            size = [ rect.width, rect.height ];
        }

        const node = this.node;
        const dataMax = max(this.props.data);

        const yScale = scaleLinear()
            .domain([0, dataMax])
            .range([0, size[1]]);

        select(node)
            .selectAll('rect')
            .data(this.props.data)
            .enter()
            .append('rect');
        
        select(node)
            .selectAll('rect')
            .data(this.props.data)
            .exit()
            .remove();
        
        select(node)
            .selectAll('rect')
            .data(this.props.data)
            .style('fill', '#fe9922')
            .attr('x', (d,i) => i * 25)
            .attr('y', d => size[1] - yScale(d))
            .attr('height', d => yScale(d))
            .attr('width', 25);
    }

    render() 
    {
        const { size } = this.state;

        return (
            <Container
                innerRef={e => this.container = e}
            >
                <svg 
                    ref={node => this.node = node}
                    width={size[0]} 
                    height={size[1]}
                >
                </svg>
            </Container>
        )
    }
}

const Container = styled.div`
    width: 100%;
    height: 100%;
`

export default BarChart