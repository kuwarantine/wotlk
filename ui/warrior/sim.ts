import { RaidBuffs } from '../core/proto/common.js';
import { PartyBuffs } from '../core/proto/common.js';
import { IndividualBuffs } from '../core/proto/common.js';
import { Debuffs } from '../core/proto/common.js';
import { Spec } from '../core/proto/common.js';
import { Stat, PseudoStat } from '../core/proto/common.js';
import { TristateEffect } from '../core/proto/common.js'
import { Stats } from '../core/proto_utils/stats.js';
import { Player } from '../core/player.js';
import { IndividualSimUI } from '../core/individual_sim_ui.js';
import { TypedEvent } from '../core/typed_event.js';
import { Gear } from '../core/proto_utils/gear.js';
import { ItemSlot } from '../core/proto/common.js';
import { GemColor } from '../core/proto/common.js';
import { Profession } from '../core/proto/common.js';


import * as IconInputs from '../core/components/icon_inputs.js';
import * as OtherInputs from '../core/components/other_inputs.js';
import * as Mechanics from '../core/constants/mechanics.js';

import * as WarriorInputs from './inputs.js';
import * as Presets from './presets.js';

export class WarriorSimUI extends IndividualSimUI<Spec.SpecWarrior> {
	constructor(parentElem: HTMLElement, player: Player<Spec.SpecWarrior>) {
		super(parentElem, player, {
			cssClass: 'warrior-sim-ui',
			cssScheme: 'warrior',
			// List any known bugs / issues here and they'll be shown on the site.
			knownIssues: [
			],

			// All stats for which EP should be calculated.
			epStats: [
				Stat.StatStrength,
				Stat.StatAgility,
				Stat.StatAttackPower,
				Stat.StatExpertise,
				Stat.StatMeleeHit,
				Stat.StatMeleeCrit,
				Stat.StatMeleeHaste,
				Stat.StatArmorPenetration,
				Stat.StatArmor,
			],
			epPseudoStats: [
				PseudoStat.PseudoStatMainHandDps,
				PseudoStat.PseudoStatOffHandDps,
			],
			// Reference stat against which to calculate EP. I think all classes use either spell power or attack power.
			epReferenceStat: Stat.StatAttackPower,
			// Which stats to display in the Character Stats section, at the bottom of the left-hand sidebar.
			displayStats: [
				Stat.StatHealth,
				Stat.StatStamina,
				Stat.StatStrength,
				Stat.StatAgility,
				Stat.StatAttackPower,
				Stat.StatExpertise,
				Stat.StatMeleeHit,
				Stat.StatMeleeCrit,
				Stat.StatMeleeHaste,
				Stat.StatArmorPenetration,
				Stat.StatArmor,
			],
			modifyDisplayStats: (player: Player<Spec.SpecWarrior>) => {
				let stats = new Stats();
				if (!player.getInFrontOfTarget()) {
					// When behind target, dodge is the only outcome affected by Expertise.
					stats = stats.addStat(Stat.StatExpertise, player.getTalents().weaponMastery * 4 * Mechanics.EXPERTISE_PER_QUARTER_PERCENT_REDUCTION);
				}
				return {
					talents: stats,
				};
			},

			defaults: {
				// Default equipped gear.
				gear: Presets.P3_FURY_PRESET_ALLIANCE.gear,
				// Default EP weights for sorting gear in the gear picker.
				epWeights: Stats.fromMap({
					[Stat.StatStrength]: 2.72,
					[Stat.StatAgility]: 1.82,
					[Stat.StatAttackPower]: 1,
					[Stat.StatExpertise]: 2.55,
					[Stat.StatMeleeHit]: 0.79,
					[Stat.StatMeleeCrit]: 2.12,
					[Stat.StatMeleeHaste]: 1.72,
					[Stat.StatArmorPenetration]: 2.17,
					[Stat.StatArmor]: 0.03,
				}, {
					[PseudoStat.PseudoStatMainHandDps]: 6.29,
					[PseudoStat.PseudoStatOffHandDps]: 3.58,
				}),
				// Default consumes settings.
				consumes: Presets.DefaultConsumes,
				// Default rotation settings.
				rotation: Presets.DefaultRotation,
				// Default talents.
				talents: Presets.FuryTalents.data,
				// Default spec-specific settings.
				specOptions: Presets.DefaultOptions,
				// Default raid/party buffs settings.
				raidBuffs: RaidBuffs.create({
					giftOfTheWild: TristateEffect.TristateEffectImproved,
					swiftRetribution: true,
					strengthOfEarthTotem: TristateEffect.TristateEffectImproved,
					icyTalons: true,
					abominationsMight: true,
					leaderOfThePack: TristateEffect.TristateEffectRegular,
					sanctifiedRetribution: true,
					bloodlust: true,
					devotionAura: TristateEffect.TristateEffectImproved,
					stoneskinTotem: TristateEffect.TristateEffectImproved,
				}),
				partyBuffs: PartyBuffs.create({
					heroicPresence: false,
				}),
				individualBuffs: IndividualBuffs.create({
					blessingOfKings: true,
					blessingOfMight: TristateEffect.TristateEffectImproved,
				}),
				debuffs: Debuffs.create({
					bloodFrenzy: true,
					heartOfTheCrusader: true,
					mangle: true,
					sunderArmor: true,
					curseOfWeakness: TristateEffect.TristateEffectRegular,
					faerieFire: TristateEffect.TristateEffectImproved,
					ebonPlaguebringer: true,
				}),
			},

			// IconInputs to include in the 'Player' section on the settings tab.
			playerIconInputs: [
				WarriorInputs.ShoutPicker,
				WarriorInputs.Recklessness,
				WarriorInputs.ShatteringThrow,
			],
			// Inputs to include in the 'Rotation' section on the settings tab.
			rotationInputs: WarriorInputs.WarriorRotationConfig,
			// Buff and Debuff inputs to include/exclude, overriding the EP-based defaults.
			includeBuffDebuffInputs: [
				// just for Bryntroll
				IconInputs.SpellDamageDebuff,
				IconInputs.SpellHitDebuff,
			],
			excludeBuffDebuffInputs: [
			],
			// Inputs to include in the 'Other' section on the settings tab.
			otherInputs: {
				inputs: [
					WarriorInputs.StartingRage,
					WarriorInputs.StanceSnapshot,
					WarriorInputs.DisableExpertiseGemming,
					OtherInputs.TankAssignment,
					OtherInputs.InFrontOfTarget,
				],
			},
			encounterPicker: {
				// Whether to include 'Execute Duration (%)' in the 'Encounter' section of the settings tab.
				showExecuteProportion: true,
			},

			presets: {
				// Preset talents that the user can quickly select.
				talents: [
					Presets.ArmsTalents,
					Presets.FuryTalents,
				],
				// Preset rotations that the user can quickly select.
				rotations: [
					Presets.ROTATION_FURY,
					Presets.ROTATION_FURY_SUNDER,
					Presets.ROTATION_ARMS,
				],
				// Preset gear configurations that the user can quickly select.
				gear: [
					Presets.PRERAID_FURY_PRESET,
					Presets.P1_FURY_PRESET,
					Presets.P2_FURY_PRESET,
					Presets.P3_FURY_PRESET_ALLIANCE,
					Presets.P3_FURY_PRESET_HORDE,
					Presets.PRERAID_ARMS_PRESET,
					Presets.P1_ARMS_PRESET,
					Presets.P2_ARMS_PRESET,
					Presets.P3_ARMS_2P_PRESET_ALLIANCE,
					Presets.P3_ARMS_4P_PRESET_ALLIANCE,
					Presets.P3_ARMS_2P_PRESET_HORDE,
					Presets.P3_ARMS_4P_PRESET_HORDE,
				],
			},
		});
		this.addOptimizeGemsAction();
	}
	addOptimizeGemsAction() {
		this.addAction('Suggest Gems', 'optimize-gems-action', async () => {
			this.optimizeGems();
		});
	}

	async optimizeGems() {
		// First, clear all existing gems
		let optimizedGear = this.player.getGear().withoutGems();

		// Next, socket the meta
		optimizedGear = optimizedGear.withMetaGem(this.sim.db.lookupGem(41398));

		// Next, socket a Nightmare Tear in the best blue socket bonus
		const epWeights = this.player.getEpWeights();
		const tearSlot = this.findTearSlot(optimizedGear, epWeights);
		optimizedGear = this.socketTear(optimizedGear, tearSlot);
		await this.updateGear(optimizedGear);

		// Next, identify all sockets where red gems will be placed
		const redSockets = this.findSocketsByColor(optimizedGear, epWeights, GemColor.GemColorRed, tearSlot);

		// Rank order red gems to use with their associated stat caps
		const redGemCaps = new Array<[number, Stats]>();
		redGemCaps.push([40117, this.calcArpCap(optimizedGear)]);
		// Should we gem expertise?
		const enableExpertiseGemming = !this.player.getSpecOptions().disableExpertiseGemming
		const expCap = this.calcExpCap();
		if(enableExpertiseGemming){
			redGemCaps.push([40118, expCap]);
		}
		const critCap = this.calcCritCap(optimizedGear);
		redGemCaps.push([40111, new Stats()]);

		// If JC, then socket 34 ArP gems in first three red sockets before proceeding
		let startIdx = 0;

		if (this.player.hasProfession(Profession.Jewelcrafting)) {
			optimizedGear = this.optimizeJcGems(optimizedGear, redSockets);
			startIdx = 3;
		}

		// Do multiple passes to fill in red gems up their caps
		optimizedGear = await this.fillGemsToCaps(optimizedGear, redSockets, redGemCaps, 0, startIdx);

		// Now repeat the process for yellow gems
		const yellowSockets = this.findSocketsByColor(optimizedGear, epWeights, GemColor.GemColorYellow, tearSlot);
		const yellowGemCaps = new Array<[number, Stats]>();
		const hitCap = new Stats().withStat(Stat.StatMeleeHit, 8. * 32.79 + 4);
		yellowGemCaps.push([40125, hitCap]);
		if(enableExpertiseGemming){
			yellowGemCaps.push([40162, hitCap.add(expCap)]);
			yellowGemCaps.push([40118, expCap]);
		}
		yellowGemCaps.push([40143, hitCap]);
		yellowGemCaps.push([40142, critCap]);
		await this.fillGemsToCaps(optimizedGear, yellowSockets, yellowGemCaps, 0, 0);
	}

	calcExpCap(): Stats {
		let expCap = 6.5 * 32.79 + 4;
		const weaponMastery = this.player.getTalents().weaponMastery;
		const hasWeaponMasteryTalent = !!weaponMastery;
		
		if (hasWeaponMasteryTalent) {
			expCap -=
				weaponMastery * 4 * Mechanics.EXPERTISE_PER_QUARTER_PERCENT_REDUCTION;
		}

		return new Stats().withStat(Stat.StatExpertise, expCap);
	}

	calcArpCap(gear: Gear): Stats {
		let arpCap = 1404;

		if (gear.hasTrinket(45931)) {
			arpCap = 659;
		} else if (gear.hasTrinket(40256)) {
			arpCap = 798;
		}

		return new Stats().withStat(Stat.StatArmorPenetration, arpCap);
	}

	calcArpTarget(gear: Gear): number {
		if (gear.hasTrinket(45931)) {
			return 648;
		}

		if (gear.hasTrinket(40256)) {
			return 787;
		}

		return 1399;
	}

	calcCritCap(gear: Gear): Stats {
		const baseCritCapPercentage = 77.8; // includes 3% Crit debuff
		let agiProcs = 0;

		if (gear.hasRelic(47668)) {
			agiProcs += 200;
		}

		if (gear.hasRelic(50456)) {
			agiProcs += 44*5;
		}

		if (gear.hasTrinket(47131) || gear.hasTrinket(47464)) {
			agiProcs += 510;
		}

		if (gear.hasTrinket(47115) || gear.hasTrinket(47303)) {
			agiProcs += 450;
		}

		if (gear.hasTrinket(44253) || gear.hasTrinket(42987)) {
			agiProcs += 300;
		}

		return new Stats().withStat(Stat.StatMeleeCrit, (baseCritCapPercentage - agiProcs*1.1*1.06*1.02/83.33) * 45.91);
	}

	async updateGear(gear: Gear): Promise<Stats> {
		this.player.setGear(TypedEvent.nextEventID(), gear);
		await this.sim.updateCharacterStats(TypedEvent.nextEventID());
		return Stats.fromProto(this.player.getCurrentStats().finalStats);
	}

	findTearSlot(gear: Gear, epWeights: Stats): ItemSlot | null {
		let tearSlot: ItemSlot | null = null;
		let maxBlueSocketBonusEP: number = 1e-8;

		for (var slot of gear.getItemSlots()) {
			const item = gear.getEquippedItem(slot);

			if (!item) {
				continue;
			}

			if (item!.numSocketsOfColor(GemColor.GemColorBlue) != 1) {
				continue;
			}

			const socketBonusEP = new Stats(item.item.socketBonus).computeEP(epWeights);

			if (socketBonusEP > maxBlueSocketBonusEP) {
				tearSlot = slot;
				maxBlueSocketBonusEP = socketBonusEP;
			}
		}

		return tearSlot;
	}

	socketTear(gear: Gear, tearSlot: ItemSlot | null): Gear {
		if (tearSlot != null) {
			const tearSlotItem = gear.getEquippedItem(tearSlot);

			for (const [socketIdx, socketColor] of tearSlotItem!.allSocketColors().entries()) {
				if (socketColor == GemColor.GemColorBlue) {
					return gear.withEquippedItem(tearSlot, tearSlotItem!.withGem(this.sim.db.lookupGem(49110), socketIdx), true);
				}
			}
		}

		return gear;
	}

	findSocketsByColor(gear: Gear, epWeights: Stats, color: GemColor, tearSlot: ItemSlot | null): Array<[ItemSlot, number]> {
		const socketList = new Array<[ItemSlot, number]>();
		const isBlacksmithing = this.player.isBlacksmithing();

		for (var slot of gear.getItemSlots()) {
			const item = gear.getEquippedItem(slot);

			if (!item) {
				continue;
			}

			const ignoreYellowSockets = ((item!.numSocketsOfColor(GemColor.GemColorBlue) > 0) && (slot != tearSlot))

			for (const [socketIdx, socketColor] of item!.curSocketColors(isBlacksmithing).entries()) {
				if (item!.hasSocketedGem(socketIdx)) {
					continue;
				}

				let matchYellowSocket = false;

				if ((socketColor == GemColor.GemColorYellow) && !ignoreYellowSockets) {
					matchYellowSocket = new Stats(item.item.socketBonus).computeEP(epWeights) > 1e-8;
				}

				if (((color == GemColor.GemColorYellow) && matchYellowSocket) || ((color == GemColor.GemColorRed) && !matchYellowSocket)) {
					socketList.push([slot, socketIdx]);
				}
			}
		}

		return socketList;
	}

	async fillGemsToCaps(gear: Gear, socketList: Array<[ItemSlot, number]>, gemCaps: Array<[number, Stats]>, numPasses: number, firstIdx: number): Promise<Gear> {
		let updatedGear: Gear = gear;
		const currentGem = this.sim.db.lookupGem(gemCaps[numPasses][0]);

		// On the first pass, we simply fill all sockets with the highest priority gem
		if (numPasses == 0) {
			for (const [itemSlot, socketIdx] of socketList.slice(firstIdx)) {
				updatedGear = updatedGear.withGem(itemSlot, socketIdx, currentGem);
			}
		}

		// If we are below the relevant stat cap for the gem we just filled on the last pass, then we are finished.
		let newStats = await this.updateGear(updatedGear);
		const currentCap = gemCaps[numPasses][1];

		if (newStats.belowCaps(currentCap) || (numPasses == gemCaps.length - 1)) {
			return updatedGear;
		}

		// If we exceeded the stat cap, then work backwards through the socket list and replace each gem with the next highest priority option until we are below the cap
		const nextGem = this.sim.db.lookupGem(gemCaps[numPasses + 1][0]);
		const nextCap = gemCaps[numPasses + 1][1];
		let capForReplacement = currentCap;

		if ((numPasses > 0) && !currentCap.equals(nextCap)) {
			capForReplacement = currentCap.subtract(nextCap);
		}

		for (var idx = socketList.length - 1; idx >= firstIdx; idx--) {
			if (newStats.belowCaps(capForReplacement)) {
				break;
			}

			const [itemSlot, socketIdx] = socketList[idx];
			updatedGear = updatedGear.withGem(itemSlot, socketIdx, nextGem);
			newStats = await this.updateGear(updatedGear);
		}

		// Now run a new pass to check whether we've exceeded the next stat cap
		let nextIdx = idx + 1;

		if (!newStats.belowCaps(currentCap)) {
			nextIdx = firstIdx;
		}

		return await this.fillGemsToCaps(updatedGear, socketList, gemCaps, numPasses + 1, nextIdx);
	}

	calcDistanceToArpTarget(numJcArpGems: number, passiveArp: number, numRedSockets: number, arpCap: number, arpTarget: number): number {
		const numNormalArpGems = Math.max(0, Math.min(numRedSockets - 3, Math.floor((arpCap - passiveArp - 34 * numJcArpGems) / 20)));
		const projectedArp = passiveArp + 34 * numJcArpGems + 20 * numNormalArpGems;
		return Math.abs(projectedArp - arpTarget);
	}

	optimizeJcGems(gear: Gear, redSocketList: Array<[ItemSlot, number]>): Gear {
		const passiveStats = Stats.fromProto(this.player.getCurrentStats().finalStats);
		const passiveArp = passiveStats.getStat(Stat.StatArmorPenetration);
		const numRedSockets = redSocketList.length;
		const arpCap = this.calcArpCap(gear).getStat(Stat.StatArmorPenetration);
		const arpTarget = this.calcArpTarget(gear);

		// First determine how many of the JC gems should be 34 ArP gems
		let optimalJcArpGems = 0;
		let minDistanceToArpTarget = this.calcDistanceToArpTarget(0, passiveArp, numRedSockets, arpCap, arpTarget);

		for (let i = 1; i <= 3; i++) {
			const distanceToArpTarget = this.calcDistanceToArpTarget(i, passiveArp, numRedSockets, arpCap, arpTarget);

			if (distanceToArpTarget < minDistanceToArpTarget) {
				optimalJcArpGems = i;
				minDistanceToArpTarget = distanceToArpTarget;
			}
		}

		// Now actually socket the gems
		let updatedGear: Gear = gear;

		for (let i = 0; i < 3; i++) {
			let gemId = 42142; // Str by default

			if (i < optimalJcArpGems) {
				gemId = 42153;
			}

			updatedGear = updatedGear.withGem(redSocketList[i][0], redSocketList[i][1], this.sim.db.lookupGem(gemId));
		}

		return updatedGear;
	}
}
