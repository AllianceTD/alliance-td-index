
local rs=game.ReplicatedStorage
local se=game:GetService("ScriptEditorService")
local function clean(v,depth)
 if depth>10 then return nil end
 local t=typeof(v)
 if t=="string"or t=="boolean"then return v end
 if t=="number"then return if v==v and math.abs(v)<math.huge then v else nil end
 if t=="Color3"then return "#"..v:ToHex()end
 if t~="table"then return nil end
 local o={} for k,x in pairs(v)do if type(k)=="string"or type(k)=="number"then local a=clean(x,depth+1)if a~=nil then o[k]=a end end end return o
end
local function fresh(v)
 local f=assert(loadstring(se:GetEditorSource(v)))
 setfenv(f,setmetatable({script=v},{__index=getfenv()}))
 return f()
end
local index=require(rs.Shared.IndexConfig)
local sources=require(rs.Shared.IndexSources)
local troops=fresh(rs.Modules.TroopsData).Troops
local out={title="Alliance TD Index",exportedAt=os.date("!%Y-%m-%dT%H:%M:%SZ"),sourcePlaceId=game.PlaceId,units={},crates=clean(fresh(rs.Modules.Crates),0),materials=clean(fresh(rs.Modules.ItemsData),0),drops=clean(require(rs.Modules.ItemDropConfig).Drops,0),crafts=clean(fresh(rs.Modules.UnitCraftConfig).Recipes,0),modes=clean(fresh(rs.Shared.ModeRewardConfig),0),maps=clean(fresh(rs.Shared.MapConfig),0),boosts=clean(fresh(rs.Modules.BoostConfig),0),orders=clean(fresh(rs.Modules.Orders),0),limits=clean(fresh(game.StarterPlayer.StarterPlayerScripts._MainUI.IndexController.UnitDetails.PlacementLimits),0)}
for _,entry in index.GetUnits()do
 local info=troops[entry.Id]
 local u=clean(info,0)u.Id=entry.Id u.Sources=clean(sources.Get(entry.Id),0)
 local module=rs.Modules.Units:FindFirstChild(entry.Id)
 u.Levels={}
 if module then
  local ok,raw=pcall(fresh,module)
  if ok and type(raw)=="table"then
   local inherited={}
   for i=1,#raw do for k,v in pairs(raw[i])do inherited[k]=v end u.Levels[i]=clean(inherited,0)end
  end
 end
 table.insert(out.units,u)
end
for _,n in {"GroupChestConfig","VIPChestConfig","VIPChestDrops"}do local v=rs.Shared:FindFirstChild(n)if v then local ok,result=pcall(fresh,v)if ok then out[n]=clean(result,0)end end end
local rewards=fresh(rs.Shared.ModeRewardConfig)
out.modes={}
for _,mode in {"Easy","Medium","Hard","Insane","Crazy","Halloween","Endless"} do out.modes[mode]=clean(rewards.GetRequired(mode),0) end
return game:GetService("HttpService"):JSONEncode(out)

