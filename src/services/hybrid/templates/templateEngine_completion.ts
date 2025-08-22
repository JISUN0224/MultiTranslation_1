          text-align: center;
          margin-bottom: 60px;
        ">🚀 향후 계획</h2>
        
        <div style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 60px;
          max-width: 800px;
          margin: 0 auto 60px;
        ">
          ${timelineHTML}
        </div>
        
        <!-- 연결 라인 -->
        <div style="
          height: 2px;
          background: linear-gradient(90deg, transparent, ${colors.accent}, transparent);
          max-width: 600px;
          margin: -40px auto 40px;
          opacity: 0.7;
        "></div>
        
        <!-- 추가 통계 -->
        <div style="
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          max-width: 800px;
          margin: 0 auto;
        ">
          <div style="
            background: rgba(255,255,255,0.2);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s ease;
          " onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
            <div style="font-size: 2.5rem; font-weight: bold; color: ${colors.accent}; margin-bottom: 10px;">100만+</div>
            <div style="font-size: 0.9rem;">목표 사용자</div>
          </div>
          <div style="
            background: rgba(255,255,255,0.2);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s ease;
          " onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
            <div style="font-size: 2.5rem; font-weight: bold; color: #00D4FF; margin-bottom: 10px;">50+</div>
            <div style="font-size: 0.9rem;">파트너사</div>
          </div>
          <div style="
            background: rgba(255,255,255,0.2);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s ease;
          " onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
            <div style="font-size: 2.5rem; font-weight: bold; color: #FF6B6B; margin-bottom: 10px;">200%</div>
            <div style="font-size: 0.9rem;">성장률</div>
          </div>
        </div>
        
        <!-- CTA 섹션 -->
        <div style="
          text-align: center;
          margin-top: 40px;
        ">
          <button style="
            background: linear-gradient(45deg, ${colors.accent}, #FFA500);
            color: white;
            padding: 20px 40px;
            border: none;
            border-radius: 50px;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(255,215,0,0.4);
            transition: all 0.3s ease;
          " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 15px 40px rgba(255,215,0,0.6)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(255,215,0,0.4)'">
            함께 성장하기
          </button>
        </div>
      </div>
    `
  };
}