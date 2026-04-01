"use client";

import { useEffect, useRef, useMemo } from "react";
import { useReWire } from "../ClientApp";
import * as d3 from "d3";
import { analyzeNetwork, type NetworkAnalysis } from "@/lib/agent/hebbian";

type SimNode = {
  id: string;
  label: string;
  region: string;
  strength: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
};

type SimLink = {
  source: string | SimNode;
  target: string | SimNode;
  weight: number;
};

// Afrofuturist constellation palette
const REGION_COLORS: Record<string, string> = {
  frontal: "#D4AF37",   // gold — motor/executive
  parietal: "#FF6B6B",  // coral — sensory
  temporal: "#15999e",   // teal — language/memory
  subcortical: "#D4AF37", // gold — deep structures
  hindbrain: "#FF6B6B",  // coral — cerebellum
};

export default function NeuralGraph() {
  const { memory } = useReWire();
  const svgRef = useRef<SVGSVGElement>(null);
  const simRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);

  const graphData = useMemo(() => {
    if (!memory) return null;
    return memory.graphState;
  }, [memory]);

  const networkStats: NetworkAnalysis | null = useMemo(() => {
    if (!graphData) return null;
    return analyzeNetwork(graphData.nodes, graphData.edges);
  }, [graphData]);

  useEffect(() => {
    if (!svgRef.current || !graphData) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.selectAll("*").remove();

    const defs = svg.append("defs");

    // Gold glow filter
    const glowGold = defs.append("filter").attr("id", "glow-gold");
    glowGold.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "blur");
    const mergeGold = glowGold.append("feMerge");
    mergeGold.append("feMergeNode").attr("in", "blur");
    mergeGold.append("feMergeNode").attr("in", "SourceGraphic");

    // Coral glow filter
    const glowCoral = defs.append("filter").attr("id", "glow-coral");
    glowCoral.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur");
    const mergeCoral = glowCoral.append("feMerge");
    mergeCoral.append("feMergeNode").attr("in", "blur");
    mergeCoral.append("feMergeNode").attr("in", "SourceGraphic");

    // Star/diamond background pattern
    const bgPattern = defs.append("pattern")
      .attr("id", "constellation-bg")
      .attr("width", 60).attr("height", 60)
      .attr("patternUnits", "userSpaceOnUse");
    bgPattern.append("rect").attr("width", 60).attr("height", 60).attr("fill", "#0a0a0a");
    bgPattern.append("circle").attr("cx", 30).attr("cy", 30).attr("r", 0.5).attr("fill", "#D4AF37").attr("opacity", 0.15);
    bgPattern.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 0.3).attr("fill", "#f5f0e8").attr("opacity", 0.08);
    bgPattern.append("circle").attr("cx", 50).attr("cy", 45).attr("r", 0.4).attr("fill", "#f5f0e8").attr("opacity", 0.06);

    // Background
    svg.append("rect").attr("width", width).attr("height", height).attr("fill", "url(#constellation-bg)");

    const nodes: SimNode[] = graphData.nodes.map((n) => ({ ...n }));
    const links: SimLink[] = graphData.edges.map((e) => ({ ...e }));

    const simulation = d3
      .forceSimulation<SimNode>(nodes)
      .force(
        "link",
        d3.forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(80)
          .strength((d) => 0.3 + (d as SimLink).weight * 0.5)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    simRef.current = simulation;

    const g = svg.append("g");

    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 3])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        }) as unknown as (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>) => void
    );

    // Constellation edges (pathway connections)
    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => {
        const w = d.weight;
        if (w > 0.7) return "#D4AF37";  // gold — strong/LTP
        if (w > 0.4) return "#FF6B6B";  // coral — moderate
        return "#5a5248";                 // muted — weak
      })
      .attr("stroke-opacity", (d) => 0.2 + d.weight * 0.6)
      .attr("stroke-width", (d) => 0.5 + d.weight * 2.5)
      .attr("stroke-dasharray", (d) => (d.weight < 0.3 ? "3 6" : "none"));

    // Animated flow on strong connections (gold energy pulse)
    g.append("g")
      .selectAll("line")
      .data(links.filter((l) => l.weight > 0.5))
      .join("line")
      .attr("stroke", "#D4AF37")
      .attr("stroke-opacity", 0.2)
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "2 8")
      .classed("neural-edge", true);

    // Constellation nodes
    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .call(
        d3.drag<SVGGElement, SimNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          }) as any
      );

    // Outer glow (cosmic halo)
    node.append("circle")
      .attr("r", (d) => 10 + d.strength * 14)
      .attr("fill", (d) => REGION_COLORS[d.region] ?? "#5a5248")
      .attr("fill-opacity", 0.08)
      .attr("filter", (d) => d.region === "frontal" || d.region === "subcortical" ? "url(#glow-gold)" : "url(#glow-coral)");

    // Diamond node shape (rotated square) for strong nodes, circle for others
    node.append("rect")
      .attr("width", (d) => (4 + d.strength * 5) * 2)
      .attr("height", (d) => (4 + d.strength * 5) * 2)
      .attr("x", (d) => -(4 + d.strength * 5))
      .attr("y", (d) => -(4 + d.strength * 5))
      .attr("transform", "rotate(45)")
      .attr("fill", (d) => REGION_COLORS[d.region] ?? "#5a5248")
      .attr("fill-opacity", (d) => 0.4 + d.strength * 0.6)
      .attr("stroke", (d) => REGION_COLORS[d.region] ?? "#5a5248")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.8);

    // Labels
    node.append("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => -(12 + d.strength * 8))
      .attr("fill", "#a09888")
      .attr("font-size", "9px")
      .attr("font-family", "Space Mono, monospace")
      .attr("letter-spacing", "0.5px")
      .attr("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);

      g.selectAll(".neural-edge")
        .attr("x1", function() { return d3.select(this).attr("x1"); })
        .attr("y1", function() { return d3.select(this).attr("y1"); });

      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // Re-sync animated links on tick
    const animatedLinks = g.selectAll(".neural-edge");
    simulation.on("tick.animated", () => {
      const strongLinks = links.filter((l) => l.weight > 0.5);
      animatedLinks.each(function(_, i) {
        const l = strongLinks[i];
        if (!l) return;
        d3.select(this)
          .attr("x1", (l.source as SimNode).x ?? 0)
          .attr("y1", (l.source as SimNode).y ?? 0)
          .attr("x2", (l.target as SimNode).x ?? 0)
          .attr("y2", (l.target as SimNode).y ?? 0);
      });
    });

    return () => { simulation.stop(); };
  }, [graphData]);

  if (!memory) return null;

  const regions = [...new Set(graphData?.nodes.map((n) => n.region) ?? [])];

  return (
    <div className="animate-fade-in">
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>
        Neural Constellation
      </p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', letterSpacing: '-0.5px', marginTop: '4px', marginBottom: '16px' }}>
        Brain Map
      </h2>

      {/* SVG Graph — full bleed */}
      <div className="overflow-hidden mb-4" style={{ background: '#0a0a0a', border: '1px solid var(--border)' }}>
        <svg
          ref={svgRef}
          width="100%"
          height="500"
          className="w-full"
          style={{ minHeight: 500 }}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {regions.map((region) => (
          <div key={region} className="flex items-center gap-2">
            <span
              style={{ width: '8px', height: '8px', background: REGION_COLORS[region], transform: 'rotate(45deg)' }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'capitalize', letterSpacing: '1px' }}>
              {region}
            </span>
          </div>
        ))}
      </div>

      {/* Edge strength guide */}
      <div className="p-3 mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Hebbian Weights
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div style={{ width: '24px', height: '1px', background: 'var(--text-muted)', opacity: 0.5, borderTop: '1px dashed var(--text-muted)' }} />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Pruned</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: '24px', height: '2px', background: 'var(--coral)' }} />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: '24px', height: '3px', background: 'var(--gold)' }} />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>LTP</span>
          </div>
        </div>
      </div>

      {/* Network Analysis */}
      {networkStats && (
        <div className="p-4 mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
            Network Analysis
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700,
                color: networkStats.resilience >= 0.7 ? 'var(--gold)' : networkStats.resilience >= 0.4 ? 'var(--coral)' : 'var(--text-muted)',
              }}>
                {Math.round(networkStats.resilience * 100)}%
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Resilience</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>
                {Math.round(networkStats.connectivity * 100)}%
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Connectivity</p>
            </div>
          </div>

          {networkStats.weakestPaths.length > 0 && (
            <div className="mb-3">
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>Weakest Pathways</p>
              {networkStats.weakestPaths.map((p, i) => {
                const fromNode = graphData?.nodes.find(n => n.id === p.from);
                const toNode = graphData?.nodes.find(n => n.id === p.to);
                return (
                  <div key={i} className="flex items-center justify-between py-1" style={{ fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {fromNode?.label ?? p.from} → {toNode?.label ?? p.to}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--coral)' }}>{p.weight}</span>
                  </div>
                );
              })}
            </div>
          )}

          {networkStats.strongestPaths.length > 0 && (
            <div className="mb-3">
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>Strongest Pathways</p>
              {networkStats.strongestPaths.map((p, i) => {
                const fromNode = graphData?.nodes.find(n => n.id === p.from);
                const toNode = graphData?.nodes.find(n => n.id === p.to);
                return (
                  <div key={i} className="flex items-center justify-between py-1" style={{ fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {fromNode?.label ?? p.from} → {toNode?.label ?? p.to}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>{p.weight}</span>
                  </div>
                );
              })}
            </div>
          )}

          {networkStats.bottlenecks.length > 0 && (
            <div className="pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Critical Nodes
              </p>
              <div className="flex flex-wrap gap-2">
                {networkStats.bottlenecks.map(id => {
                  const n = graphData?.nodes.find(n => n.id === id);
                  return (
                    <span key={id} style={{
                      fontFamily: 'var(--font-mono)', fontSize: '10px',
                      background: 'var(--gold-dim)', color: 'var(--gold)',
                      padding: '2px 8px', letterSpacing: '0.5px',
                    }}>
                      {n?.label ?? id}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hebbian Model */}
      <div className="p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Plasticity Model
        </p>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <p><span style={{ color: 'var(--gold)' }}>Hebbian:</span> Co-activated nodes strengthen (dW = n * pre * post)</p>
          <p><span style={{ color: 'var(--coral)' }}>Decay:</span> Unused connections weaken (W * 0.995^hours)</p>
          <p><span style={{ color: 'var(--gold)' }}>LTP:</span> 3+ co-activations raise permanent weight floor</p>
          <p><span style={{ color: 'var(--coral)' }}>LTD:</span> Failed activations weaken 1.5x faster</p>
          <p><span style={{ color: 'var(--teal-bright)' }}>Homeostatic:</span> Incoming weight per node capped at 3.0</p>
        </div>
      </div>
    </div>
  );
}
