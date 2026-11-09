import { describe, expect, it } from 'vitest'
import { intToIp, ipToInt } from './logic'

describe('IPv4 转换', () => {
  it('点分十进制转整数', () => {
    expect(ipToInt('192.168.1.1')).toBe(3232235777)
    expect(ipToInt('10.0.0.1')).toBe(167772161)
    expect(ipToInt('0.0.0.0')).toBe(0)
    expect(ipToInt('255.255.255.255')).toBe(4294967295)
  })

  it('整数转点分十进制', () => {
    expect(intToIp(3232235777)).toBe('192.168.1.1')
    expect(intToIp(167772161)).toBe('10.0.0.1')
    expect(intToIp(0)).toBe('0.0.0.0')
    expect(intToIp(4294967295)).toBe('255.255.255.255')
  })

  it('往返一致，含大于 2^31 的地址', () => {
    for (const ip of ['1.2.3.4', '127.0.0.1', '172.16.254.1', '192.168.0.1', '223.255.255.254', '255.255.255.255']) {
      expect(intToIp(ipToInt(ip))).toBe(ip)
    }
  })

  it('/24 网段计算不会被位运算截断成负数', () => {
    const int = ipToInt('192.168.1.1')
    expect(intToIp((int & 0xffffff00) >>> 0)).toBe('192.168.1.0')
    expect(intToIp((ipToInt('255.255.255.255') & 0xffffff00) >>> 0)).toBe('255.255.255.0')
  })

  it('非法输入抛错', () => {
    expect(() => ipToInt('1.2.3')).toThrow()
    expect(() => ipToInt('256.1.1.1')).toThrow()
    expect(() => ipToInt('a.b.c.d')).toThrow()
    expect(() => intToIp(-1)).toThrow()
    expect(() => intToIp(4294967296)).toThrow()
  })
})
