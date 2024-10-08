import { getWaveCurrency, isMultipleEnemySpawnData, TIME_BETWEEN_WAVES_MS, waves } from '../constants/waves.ts';
import { PlayerCurrencyContext } from '../context/currency.ts';
import { EnemyContext } from '../context/enemies.ts';
import { RENDER_CONTEXT } from '../context/render.ts';
import { LivingRenderObject } from './object.ts';
import { CurrentWaveContext, TotalWaveContext } from '../context/wave.ts';
import { allEnemies } from '../constants/enemies.ts';
import { choice } from '../util/random.ts';

const MIN_TIME_BETWEEN_RANDOM_ENEMIES_MS = 2_000;
const MAX_TIME_BETWEEN_RANDOM_ENEMIES_MS = 8_000;

// this is dumb, but there's a circular dependency issue when including waves from the wave object
TotalWaveContext.value = waves.length;

export class Spawner extends LivingRenderObject {
    #currentWaveIndex = 0;
    #currentSpawnIndex = 0;
    #timer = TIME_BETWEEN_WAVES_MS;
    #isDoneSpawning = false;
    #isReadyForNextWave = false;

    #pokeNextWave() {
        if (EnemyContext.size > 0) {
            return;
        }

        PlayerCurrencyContext.value += getWaveCurrency(this.#currentWaveIndex);
        this.#currentWaveIndex += 1;
        this.#currentSpawnIndex = 0;
        this.#isDoneSpawning = false;
        this.#isReadyForNextWave = false;
        this.#timer = TIME_BETWEEN_WAVES_MS;
    }

    tick(): void {
        CurrentWaveContext.value = this.#currentWaveIndex;

        if (this.#timer > 0) {
            this.#timer = Math.max(0, this.#timer - RENDER_CONTEXT.deltaTimeMs);
            return;
        }

        if (this.#currentWaveIndex >= waves.length) {
            this.#timer = Math.random() * (MAX_TIME_BETWEEN_RANDOM_ENEMIES_MS - MIN_TIME_BETWEEN_RANDOM_ENEMIES_MS) + MIN_TIME_BETWEEN_RANDOM_ENEMIES_MS;
            choice(allEnemies)();
            return;
        }

        if (this.#isReadyForNextWave) {
            this.#pokeNextWave();
            return;
        }

        const currentWave = waves[this.#currentWaveIndex];
        if (!this.#isDoneSpawning) {
            const currentSpawn = currentWave[this.#currentSpawnIndex];
            currentSpawn.enemy();

            let finishedSpawningThisEnemy = true;
            if (isMultipleEnemySpawnData(currentSpawn)) {
                this.#timer = currentSpawn.timeBetweenSpawnsMs;
                currentSpawn.count -= 1;

                finishedSpawningThisEnemy = currentSpawn.count <= 0;
            }

            if (finishedSpawningThisEnemy) {
                this.#currentSpawnIndex += 1;
                if (currentSpawn.timeAfterLastSpawnMs) {
                    this.#timer = currentSpawn.timeAfterLastSpawnMs;
                }
            }

            if (this.#currentSpawnIndex >= currentWave.length) {
                this.#isDoneSpawning = true;
            }
        } else {
            this.#isReadyForNextWave = true;
        }
    }
}