import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, MapPin, Search, CheckCircle2, Clock, Loader2, RefreshCw, AlertCircle, Sparkles, Filter, Shield } from 'lucide-react';
import { getTeamLogo } from '../../utils/teamUtils';

function formatDate(dateInput) {
  if (!dateInput) return 'TBD';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CoachMatchesView({ searchQuery = '' }) {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'results'
  const [rawFixtures, setRawFixtures] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('ALL'); // 'ALL' | 'CLUBVERSE' | teamId
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch fixtures & teams directly from MongoDB API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fRes, tRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/fixtures` ),
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/teams` )
      ]);

      if (fRes.ok) {
        const data = await fRes.json();
        if (Array.isArray(data)) setRawFixtures(data);
      } else {
        setError('Failed to fetch fixtures from database.');
      }

      if (tRes.ok) {
        const tData = await tRes.json();
        if (Array.isArray(tData)) setTeams(tData);
      }
    } catch (err) {
      console.warn('Backend fetch note:', err);
      setError('Network error connecting to backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateSeason = async () => {
    try {
      setGenerating(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/fixtures/generate-league` , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      triggerToast(data.message || 'Season schedule auto-generated!');
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to generate season schedule.');
    } finally {
      setGenerating(false);
    }
  };

  // Map Upcoming Fixtures from DB
  const upcomingFixtures = rawFixtures
    .filter(f => f.status !== 'Completed')
    .map((f, idx) => {
      const homeTeam = f.home_team || { name: 'ClubVerse FC', short_name: 'CVFC' };
      const awayTeam = f.away_team || { name: 'Opponent', short_name: 'OPP' };
      const isClubVerseHome = (homeTeam.name || '').toLowerCase().includes('clubverse');
      const isClubVerseAway = (awayTeam.name || '').toLowerCase().includes('clubverse');
      const isClubVerseMatch = isClubVerseHome || isClubVerseAway;

      return {
        id: f._id || idx,
        homeTeam,
        awayTeam,
        homeLogo: getTeamLogo(homeTeam),
        awayLogo: getTeamLogo(awayTeam),
        isClubVerseMatch,
        competition: f.competition || 'Premier League',
        date: formatDate(f.match_date),
        time: f.match_time || '20:00 BST',
        venue: f.venue || `${homeTeam.name} Stadium`,
        tacticalFormation: f.tactical_formation || (idx % 2 === 0 ? '4-3-3 High Press' : '4-2-3-1 Mid-Block'),
        squadReadiness: f.squad_readiness || 'Roster Finalized',
        status: f.status || 'Upcoming'
      };
    });

  // Map Completed Match Results from DB
  const matchResults = rawFixtures
    .filter(f => f.status === 'Completed')
    .map((f, idx) => {
      const homeTeam = f.home_team || { name: 'ClubVerse FC', short_name: 'CVFC' };
      const awayTeam = f.away_team || { name: 'Opponent', short_name: 'OPP' };
      const isClubVerseHome = (homeTeam.name || '').toLowerCase().includes('clubverse');
      const isClubVerseAway = (awayTeam.name || '').toLowerCase().includes('clubverse');
      const isClubVerseMatch = isClubVerseHome || isClubVerseAway;

      const homeScore = f.home_score ?? 0;
      const awayScore = f.away_score ?? 0;

      let outcome = 'Draw';
      let outcomeColor = 'Draw';
      if (isClubVerseMatch) {
        if (isClubVerseHome) {
          if (homeScore > awayScore) { outcome = 'Win'; outcomeColor = 'Win'; }
          else if (homeScore < awayScore) { outcome = 'Loss'; outcomeColor = 'Loss'; }
        } else {
          if (awayScore > homeScore) { outcome = 'Win'; outcomeColor = 'Win'; }
          else if (awayScore < homeScore) { outcome = 'Loss'; outcomeColor = 'Loss'; }
        }
      } else {
        if (homeScore > awayScore) { outcome = `${homeTeam.short_name || homeTeam.name} Win`; outcomeColor = 'Win'; }
        else if (awayScore > homeScore) { outcome = `${awayTeam.short_name || awayTeam.name} Win`; outcomeColor = 'Win'; }
        else { outcome = 'Draw'; outcomeColor = 'Draw'; }
      }

      return {
        id: f._id || `res-${idx}`,
        homeTeam,
        awayTeam,
        homeLogo: getTeamLogo(homeTeam),
        awayLogo: getTeamLogo(awayTeam),
        isClubVerseMatch,
        score: `${homeScore} - ${awayScore}`,
        outcome: outcome,
        outcomeColor: outcomeColor,
        date: formatDate(f.match_date),
        coachNotes: f.coach_notes || 'Tactical discipline maintained with effective box coverage.'
      };
    });

  // Apply Team Scope Filter & Search Query
  const matchesTeamFilter = (f) => {
    if (selectedTeamId === 'ALL') return true;
    if (selectedTeamId === 'CLUBVERSE') {
      return (f.homeTeam.name || '').toLowerCase().includes('clubverse') ||
             (f.awayTeam.name || '').toLowerCase().includes('clubverse');
    }
    return String(f.homeTeam._id) === String(selectedTeamId) ||
           String(f.awayTeam._id) === String(selectedTeamId) ||
           f.homeTeam.name === selectedTeamId ||
           f.awayTeam.name === selectedTeamId;
  };

  const filteredUpcoming = upcomingFixtures.filter(f => 
    matchesTeamFilter(f) && (
      f.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.competition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.venue.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredResults = matchResults.filter(r => 
    matchesTeamFilter(r) && (
      r.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.score.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.coachNotes.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 font-bold text-xs rounded-2xl flex items-center justify-between shadow-sm">
          <span>✅ {toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-900 underline">Dismiss</button>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
              Matches & Fixture Manager
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#20221F] text-[#BEF264] text-[10px] font-black uppercase tracking-wider">
              {teams.length} Teams Competing
            </span>
          </div>
          <p className="text-xs text-[#6F716B] mt-1">
            Manage upcoming matchday tactics, rosters, and analyze league fixtures across all competing teams.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Generate Schedule Button */}
          <button
            onClick={handleGenerateSeason}
            disabled={generating}
            className="px-3.5 py-2 rounded-full text-xs font-bold bg-[#BEF264] hover:bg-[#a9d949] text-[#20221F] shadow-warm-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
            title="Generate full season schedule across all registered teams"
          >
            {generating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#20221F]" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-[#20221F]" />
            )}
            <span>Generate Full Season</span>
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-[#20221F] text-white shadow-warm-sm'
                : 'bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F] border border-[#E4E1D8]'
            }`}
          >
            Upcoming Fixtures ({upcomingFixtures.length})
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'results'
                ? 'bg-[#20221F] text-[#BEF264] shadow-warm-sm font-black'
                : 'bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F] border border-[#E4E1D8]'
            }`}
          >
            Match Results ({matchResults.length})
          </button>

          <button
            onClick={fetchData}
            className="p-2 rounded-full bg-[#F7F5EF] hover:bg-[#E4E1D8] text-[#20221F] transition-colors border border-[#E4E1D8]"
            title="Refresh Fixtures from Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Team Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-[#F7F5EF] border border-[#E4E1D8] rounded-2xl">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#6F716B] pr-2 border-r border-[#E4E1D8]">
          <Filter className="w-3.5 h-3.5 text-[#7A8B5A]" />
          <span>Team Filter:</span>
        </div>

        <button
          onClick={() => setSelectedTeamId('ALL')}
          className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
            selectedTeamId === 'ALL'
              ? 'bg-[#20221F] text-white shadow-sm'
              : 'bg-white text-[#6F716B] hover:text-[#20221F] border border-[#E4E1D8]'
          }`}
        >
          All League Fixtures
        </button>

        <button
          onClick={() => setSelectedTeamId('CLUBVERSE')}
          className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
            selectedTeamId === 'CLUBVERSE'
              ? 'bg-[#7A8B5A] text-white shadow-sm'
              : 'bg-white text-[#7A8B5A] hover:bg-[#7A8B5A]/10 border border-[#E4E1D8]'
          }`}
        >
          <Shield className="w-3 h-3" />
          ClubVerse Matches
        </button>

        {teams.length > 0 && (
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="px-3 py-1 rounded-xl text-xs font-bold bg-white text-[#20221F] border border-[#E4E1D8] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
          >
            <option value="ALL">Select Specific Team...</option>
            {teams.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.short_name})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl">
          <Loader2 className="w-8 h-8 text-[#7A8B5A] animate-spin" />
          <p className="text-xs font-semibold text-[#6F716B]">Fetching match fixtures across all 10 teams from MongoDB...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchData} className="ml-auto underline font-bold">Retry</button>
        </div>
      )}

      {/* Upcoming Fixtures */}
      {!loading && activeTab === 'upcoming' && (
        <div className="space-y-4">
          {filteredUpcoming.length === 0 ? (
            <div className="p-8 text-center bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl space-y-2">
              <Trophy className="w-8 h-8 text-[#7A8B5A] mx-auto opacity-50" />
              <p className="text-sm font-bold text-[#20221F]">No Upcoming Fixtures Found</p>
              <p className="text-xs text-[#6F716B]">No matches match your team filter or search criteria in the database.</p>
              <button
                onClick={handleGenerateSeason}
                className="mt-2 px-4 py-2 bg-[#20221F] text-[#BEF264] rounded-full text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Auto-Generate Season Schedule
              </button>
            </div>
          ) : (
            filteredUpcoming.map((fixture) => (
              <motion.div
                key={fixture.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-[#FFFDF8] border rounded-3xl p-6 shadow-warm-md flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors ${
                  fixture.isClubVerseMatch ? 'border-[#7A8B5A] bg-[#FFFDF6]' : 'border-[#E4E1D8]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#7A8B5A]">
                    <Trophy className="w-4 h-4 text-[#7A8B5A]" />
                    <span className="uppercase tracking-wider">{fixture.competition}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#BEF264]/30 text-[#20221F] text-[10px] font-black uppercase ml-2">
                      {fixture.status}
                    </span>

                    {fixture.isClubVerseMatch && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#7A8B5A] text-white text-[10px] font-black uppercase tracking-wider ml-auto md:ml-2">
                        ClubVerse Match
                      </span>
                    )}
                  </div>

                  {/* Club Logos and Team Names */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white border border-[#E4E1D8] shadow-sm flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                        <img 
                          src={fixture.homeLogo} 
                          alt={fixture.homeTeam.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=200&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                      <span className="font-serif font-black text-xl sm:text-2xl text-[#20221F]">
                        {fixture.homeTeam.name}
                      </span>
                    </div>

                    <span className="text-[#6F716B] font-light text-lg px-1">vs</span>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white border border-[#E4E1D8] shadow-sm flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                        <img 
                          src={fixture.awayLogo} 
                          alt={fixture.awayTeam.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=200&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                      <span className="font-serif font-black text-xl sm:text-2xl text-[#20221F]">
                        {fixture.awayTeam.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#6F716B]">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-[#7A8B5A]" />
                      {fixture.date} • {fixture.time}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#7A8B5A]" />
                      {fixture.venue}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="p-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-right">
                    <div className="text-[10px] font-bold text-[#6F716B]">Tactical Formation</div>
                    <div className="text-xs font-black text-[#20221F]">{fixture.tacticalFormation}</div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Match Results */}
      {!loading && activeTab === 'results' && (
        <div className="space-y-4">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#7A8B5A] mx-auto opacity-50" />
              <p className="text-sm font-bold text-[#20221F]">No Match Results Found</p>
              <p className="text-xs text-[#6F716B]">No past match results recorded match your filter criteria.</p>
            </div>
          ) : (
            filteredResults.map((res) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-[#FFFDF8] border rounded-3xl p-6 shadow-warm-md flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors ${
                  res.isClubVerseMatch ? 'border-[#7A8B5A] bg-[#FFFDF6]' : 'border-[#E4E1D8]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      res.outcomeColor === 'Win' 
                        ? 'bg-emerald-100 text-emerald-800'
                        : res.outcomeColor === 'Draw'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {res.outcome}
                    </span>
                    <span className="text-xs text-[#6F716B] font-semibold">{res.date}</span>
                    {res.isClubVerseMatch && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#7A8B5A] text-white text-[10px] font-black uppercase tracking-wider ml-auto md:ml-2">
                        ClubVerse Match
                      </span>
                    )}
                  </div>

                  {/* Club Logos and Score */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white border border-[#E4E1D8] shadow-sm flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                        <img 
                          src={res.homeLogo} 
                          alt={res.homeTeam.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=200&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                      <span className="font-serif font-black text-xl sm:text-2xl text-[#20221F]">
                        {res.homeTeam.name}
                      </span>
                    </div>

                    <span className="px-3 py-1 rounded-xl bg-[#20221F] text-[#BEF264] text-xl font-mono mx-1 shadow-sm">
                      {res.score}
                    </span>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white border border-[#E4E1D8] shadow-sm flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                        <img 
                          src={res.awayLogo} 
                          alt={res.awayTeam.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=200&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                      <span className="font-serif font-black text-xl sm:text-2xl text-[#20221F]">
                        {res.awayTeam.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs space-y-1 md:max-w-md shrink-0">
                  <div className="font-bold text-[#20221F]">Matchday Analysis</div>
                  <p className="text-[#6F716B] leading-relaxed">{res.coachNotes}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
